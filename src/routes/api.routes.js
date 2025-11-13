const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const apiAuthorsRoutes = require('./authors.routes');
const apiPostsRoutes = require('./posts.routes');

router.get('/status', async (req, res) => {

    let dbStatus = 'UNKNOWN';

    try {
        const connection = await pool.getConnection();
        await connection.ping();
        dbStatus = 'OK';
        connection.release();
    } catch (error) {
        dbStatus = 'ERROR';
    }

    res.json({
        service: 'API_Blog',
        status: 'OK',
        database: dbStatus,
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        uptime: process.uptime().toFixed(0) + 's',
    });
});

router.use('/authors', apiAuthorsRoutes);
router.use('/posts', apiPostsRoutes);

module.exports = router;