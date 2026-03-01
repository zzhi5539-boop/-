require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const routePlanningRoutes = require('./routes/routes');
const financeRoutes = require('./routes/finance');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/routes', routePlanningRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/finance', financeRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
