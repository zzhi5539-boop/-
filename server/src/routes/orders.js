const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all orders with tracking info
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_tracking(*)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        
        // Handle order_tracking since it can be either an object (1-to-1) or array depending on Supabase version
        const formattedData = data.map(order => {
            let tracking = order.order_tracking;
            if (Array.isArray(tracking)) {
                tracking = tracking.length > 0 ? tracking[0] : null;
            }
            return {
                ...order,
                order_tracking: tracking
            };
        });
        
        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update tracking info for an order
router.put('/tracking/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { current_speed, congestion_level, eta_timestamp } = req.body;

        const { data, error } = await supabase
            .from('order_tracking')
            .upsert({ 
                order_id: id, 
                current_speed, 
                congestion_level, 
                eta_timestamp,
                updated_at: new Date().toISOString()
            })
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        const {
            id, date, product, product_detail, product_image,
            origin, origin_detail, destination, destination_detail,
            status, driver, driver_image, temperature, cold_chain, crop_type, priority
        } = req.body;

        const { data, error } = await supabase
            .from('orders')
            .insert([{
                id, date, product, product_detail, product_image,
                origin, origin_detail, destination, destination_detail,
                status, driver, driver_image, temperature, cold_chain, crop_type, priority
            }])
            .select();

        if (error) throw error;
        
        // Auto-provision default tracking data
        const { error: trackingError } = await supabase
            .from('order_tracking')
            .insert([{
                order_id: id,
                current_speed: 0,
                current_temperature: 15.0,
                humidity: 60.0,
                fuel_level: 100.0,
                congestion_level: '未知',
                eta_timestamp: null
            }]);
            
        if (trackingError) console.error("Failed to provision tracking data:", trackingError);

        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update order by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const { data, error } = await supabase
            .from('orders')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data.length === 0) return res.status(404).json({ message: "Order not found" });
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete order by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
