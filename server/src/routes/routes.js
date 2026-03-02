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

// Helper: Calculate total route distance for an array of points (first point is depot)
const calculateTotalDistance = (points) => {
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
        total += calculateDistance(points[i].lat, points[i].lng, points[i + 1].lat, points[i + 1].lng);
    }
    return total;
};

// 2-opt: Reverse a segment of the route between index i and j (inclusive)
const twoOptSwap = (route, i, j) => {
    const newRoute = [
        ...route.slice(0, i),
        ...route.slice(i, j + 1).reverse(),
        ...route.slice(j + 1)
    ];
    return newRoute;
};

// 2-opt local optimization: repeatedly try reversing sub-segments to shorten total distance
const twoOptOptimize = (depot, route, maxIterations = 500) => {
    // Build a full path including depot as the first "node"
    let bestRoute = [...route];
    let improved = true;
    let iterations = 0;

    while (improved && iterations < maxIterations) {
        improved = false;
        iterations++;

        for (let i = 0; i < bestRoute.length - 1; i++) {
            for (let j = i + 1; j < bestRoute.length; j++) {
                // Calculate cost of current edges that would be removed
                const pointA = i === 0 ? depot : bestRoute[i - 1];
                const pointB = bestRoute[i];
                const pointC = bestRoute[j];
                const pointD = j === bestRoute.length - 1 ? null : bestRoute[j + 1];

                // Current distance of the two edges: A→B and C→D
                let currentCost = calculateDistance(pointA.lat, pointA.lng, pointB.lat, pointB.lng);
                if (pointD) {
                    currentCost += calculateDistance(pointC.lat, pointC.lng, pointD.lat, pointD.lng);
                }

                // New distance if we reverse segment [i..j]: A→C and B→D
                let newCost = calculateDistance(pointA.lat, pointA.lng, pointC.lat, pointC.lng);
                if (pointD) {
                    newCost += calculateDistance(pointB.lat, pointB.lng, pointD.lat, pointD.lng);
                }

                // If the new configuration is shorter, apply the swap
                if (newCost < currentCost - 0.001) { // small epsilon to avoid floating point loops
                    bestRoute = twoOptSwap(bestRoute, i, j);
                    improved = true;
                }
            }
        }
    }

    return { route: bestRoute, iterations };
};

// POST /api/routes/optimize - Greedy Nearest Neighbor + 2-opt Local Optimization
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

        // 2. Attach stable coordinates to orders
        let unvisitedOrders = dbOrders.map(order => ({
            order_id: order.id,
            product: order.product,
            status: order.status,
            ...getOrderRealCoordinates(order.id)
        }));

        // ====== Phase 1: Greedy Nearest Neighbor (initial solution) ======
        let greedyRoute = [];
        let currentLocation = { ...depot };

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

            const nextStop = unvisitedOrders[nearestIndex];
            greedyRoute.push(nextStop);
            currentLocation = { lat: nextStop.lat, lng: nextStop.lng };
            unvisitedOrders.splice(nearestIndex, 1);
        }

        const greedyDistance = calculateTotalDistance([depot, ...greedyRoute]);

        // ====== Phase 2: 2-opt Local Optimization ======
        const { route: optimizedStops, iterations } = twoOptOptimize(depot, greedyRoute);

        // Recalculate per-segment distances for the optimized route
        let totalDistanceKm = 0;
        const optimizedRoute = optimizedStops.map((stop, index) => {
            const prev = index === 0 ? depot : optimizedStops[index - 1];
            const dist = calculateDistance(prev.lat, prev.lng, stop.lat, stop.lng);
            totalDistanceKm += dist;
            return {
                ...stop,
                distance_from_prev: Number(dist.toFixed(2))
            };
        });

        const improvementPercent = greedyDistance > 0
            ? Number(((1 - totalDistanceKm / greedyDistance) * 100).toFixed(1))
            : 0;

        // Output
        res.json({
            depot: depot,
            ordered_waypoints: optimizedRoute,
            total_items: optimizedRoute.length,
            total_distance_km: Number(totalDistanceKm.toFixed(2)),
            optimization: {
                algorithm: 'Greedy Nearest Neighbor + 2-opt',
                greedy_distance_km: Number(greedyDistance.toFixed(2)),
                optimized_distance_km: Number(totalDistanceKm.toFixed(2)),
                improvement_percent: improvementPercent,
                iterations: iterations
            }
        });

    } catch (error) {
        console.error('Routing optimization error:', error);
        res.status(500).json({ error: 'Failed to optimize route' });
    }
});

module.exports = router;
