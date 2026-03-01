const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Helper: Pseudo-random generator to ensure consistent coordinates for the same order ID
const seededRandom = (seed) => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    }
    let t = h += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

// Map Order ID to Real Coordinates (Around Beijing: 39.9042, 116.4074)
const getOrderRealCoordinates = (orderId) => {
    const randLatOffset = (seededRandom(orderId + '_lat') - 0.5) * 0.5;
    const randLngOffset = (seededRandom(orderId + '_lng') - 0.5) * 0.5;
    return {
        lat: 39.9042 + randLatOffset,
        lng: 116.4074 + randLngOffset
    };
};

// Haversine formula to calculate distance between two lat/lng points in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

// POST /api/routes/optimize - Greedy TSP Algorithm
router.post('/optimize', async (req, res) => {
    try {
        const { orderIds, depot = { lat: 39.9042, lng: 116.4074 } } = req.body;

        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).json({ error: 'orderIds array is required' });
        }

        // 1. Fetch requested orders from DB
        const { data: dbOrders, error } = await supabase
            .from('orders')
            .select('*')
            .in('id', orderIds);

        if (error) {
            throw error;
        }

        if (!dbOrders || dbOrders.length === 0) {
            return res.status(404).json({ error: 'No valid orders found' });
        }

        // 2. Attach stable coordinates to orders based on our existing logic
        let unvisitedOrders = dbOrders.map(order => ({
            order_id: order.id,
            product: order.product,
            status: order.status,
            ...getOrderRealCoordinates(order.id)
        }));

        // 3. Greedy Routing Logic (Nearest Neighbor)
        let optimizedRoute = [];
        let currentLocation = depot;
        let totalDistanceKm = 0;

        // We keep finding the closest unvisited order to our currentLocation
        while (unvisitedOrders.length > 0) {
            let nearestIndex = -1;
            let minDistance = Infinity;

            for (let i = 0; i < unvisitedOrders.length; i++) {
                const order = unvisitedOrders[i];
                const distance = calculateDistance(
                    currentLocation.lat, currentLocation.lng,
                    order.lat, order.lng
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    nearestIndex = i;
                }
            }

            // Add the closest order to the route
            const nextStop = unvisitedOrders[nearestIndex];
            optimizedRoute.push({
                ...nextStop,
                distance_from_prev: Number(minDistance.toFixed(2)) // Round to 2 decimals
            });

            // Update counters & state
            totalDistanceKm += minDistance;
            currentLocation = { lat: nextStop.lat, lng: nextStop.lng };

            // Remove from unvisited pool
            unvisitedOrders.splice(nearestIndex, 1);
        }

        // Output calculation
        res.json({
            depot: depot,
            ordered_waypoints: optimizedRoute,
            total_items: optimizedRoute.length,
            total_distance_km: Number(totalDistanceKm.toFixed(2))
        });

    } catch (error) {
        console.error('Routing optimization error:', error);
        res.status(500).json({ error: 'Failed to optimize route' });
    }
});

module.exports = router;
