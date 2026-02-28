const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all users
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new user
router.post('/', async (req, res) => {
    try {
        const { name, email, role, status, access_level, initials } = req.body;
        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, role, status, access_level, initials }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data.length === 0) return res.status(404).json({ message: "User not found" });
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data.length === 0) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully", user: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
