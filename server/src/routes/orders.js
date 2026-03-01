const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
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
            status, driver, driver_image, temperature, cold_chain
        } = req.body;

        const { data, error } = await supabase
            .from('orders')
            .insert([{
                id, date, product, product_detail, product_image,
                origin, origin_detail, destination, destination_detail,
                status, driver, driver_image, temperature, cold_chain
            }])
            .select();

        if (error) throw error;
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
