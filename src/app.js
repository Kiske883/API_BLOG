// importamos librerias genericas 
const express = require('express');
const cors = require('cors');
const logger = require('./config/logger');

// importamos rutas propias
const apiRoutes = require('./routes/api.routes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', apiRoutes);

// 404 handler
app.use((req, res, next) => {
    
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    logger.error(`Not found: ${req.method} ${fullUrl}`);

    res.status(404).json({
        message: "Not found"
    });
});

// Error handler
app.use((err, req, res, next) => {    
    logger.error(err.stack);
    res.status(500).json({ message: err.message });
});

module.exports = app;