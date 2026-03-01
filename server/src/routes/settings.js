const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Default settings if the table is empty or doesn't exist yet
const DEFAULT_SETTINGS = {
    system_name: '农业物流智能管理系统',
    notification_email: 'admin@agrilogistics.com',
    temperature_alert_min: 2,
    temperature_alert_max: 25,
    auto_dispatch: true,
    language: 'zh-CN',
    data_retention_days: 90,
};

// GET /api/settings — Fetch all settings
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('system_settings')
            .select('*');

        if (error) {
            // Table might not exist yet, return defaults
            console.warn('Settings table not found, returning defaults:', error.message);
            return res.json(DEFAULT_SETTINGS);
        }

        if (!data || data.length === 0) {
            return res.json(DEFAULT_SETTINGS);
        }

        // Convert rows [{key, value}, ...] to an object { key: value }
        const settings = { ...DEFAULT_SETTINGS };
        data.forEach(row => {
            // Parse booleans and numbers
            if (row.value === 'true') settings[row.key] = true;
            else if (row.value === 'false') settings[row.key] = false;
            else if (!isNaN(Number(row.value)) && row.value.trim() !== '') settings[row.key] = Number(row.value);
            else settings[row.key] = row.value;
        });

        res.json(settings);
    } catch (err) {
        console.error('Get settings error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/settings — Upsert settings
router.put('/', async (req, res) => {
    try {
        const settings = req.body;

        // Convert object to rows for upsert
        const rows = Object.entries(settings).map(([key, value]) => ({
            key,
            value: String(value),
        }));

        const { error } = await supabase
            .from('system_settings')
            .upsert(rows, { onConflict: 'key' });

        if (error) throw error;

        res.json({ message: '设置已保存', settings });
    } catch (err) {
        console.error('Update settings error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
