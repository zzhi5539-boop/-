const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Simulated unit price mapping for products (CNY per kg)
const PRODUCT_PRICES = {
    '有机番茄': 12,
    '特级芒果': 28,
    '甜玉米': 5,
    '牛油果': 35,
};
const DEFAULT_PRICE = 15;

// Cost ratio: logistics cost as a percentage of revenue
const COST_RATIO = 0.35;

// GET /api/finance/summary — Derive financial data from orders
router.get('/summary', async (req, res) => {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        let totalRevenue = 0;
        let totalCost = 0;

        const orderFinance = (orders || []).map(order => {
            // Parse weight from product_detail, e.g. "500 kg • 箱装 A2"
            const weightMatch = order.product_detail?.match(/(\d+)\s*kg/i);
            const weight = weightMatch ? parseInt(weightMatch[1]) : 100;
            const unitPrice = PRODUCT_PRICES[order.product] || DEFAULT_PRICE;
            const revenue = weight * unitPrice;
            const cost = Math.round(revenue * COST_RATIO);
            const profit = revenue - cost;

            totalRevenue += revenue;
            totalCost += cost;

            return {
                id: order.id,
                date: order.date,
                product: order.product,
                origin: order.origin,
                destination: order.destination,
                status: order.status,
                weight_kg: weight,
                unit_price: unitPrice,
                revenue,
                cost,
                profit,
            };
        });

        res.json({
            summary: {
                total_revenue: totalRevenue,
                total_cost: totalCost,
                net_profit: totalRevenue - totalCost,
                order_count: (orders || []).length,
                completed_count: (orders || []).filter(o => o.status === '已完成').length,
                in_transit_count: (orders || []).filter(o => o.status === '运输中').length,
            },
            orders: orderFinance,
        });
    } catch (err) {
        console.error('Finance summary error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
