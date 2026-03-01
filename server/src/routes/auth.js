const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: '请输入邮箱和密码' });
        }

        // Fetch user from public.users table in Supabase
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email);

        if (error) {
            console.error('Supabase query error:', error);
            return res.status(500).json({ message: '服务器内部错误' });
        }

        if (!users || users.length === 0) {
            // POC specific: If user not found, we just return an error
            return res.status(401).json({ message: '未找到该邮箱对应的用户' });
        }

        const user = users[0];

        // In a real app we'd check password hashes here. For POC, we just accept if email exists.

        // Return successful login
        res.json({
            message: '登录成功',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                access_level: user.access_level,
                initials: user.initials
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: '登录处理期间发生错误' });
    }
});

module.exports = router;
