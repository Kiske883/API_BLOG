// Server creation and configuration
const http = require('node:http');
const app = require('./src/app');
const pool = require('./src/config/db');
const dotenv = require('dotenv');
const logger = require('./src/config/logger');

// Config .env
dotenv.config();

// Server creation
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT);

// Listeners
server.on("listening", async () => {
    
    logger.info(`Server listening on port ${PORT}`);

    try {
        const connection = await pool.getConnection();

        logger.info('Conexión a la base de datos MySQL exitosa!');

        connection.release();
    } catch (error) {

        logger.error('Error conectando a la base de datos:', error.message);
    }    
});

server.on("error", (error) => {

    logger.error('Error conectando a la base de datos:', error);
});
