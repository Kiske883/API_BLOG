// importamos librerias genericas 
const express = require('express');
const cors = require('cors');
const logger = require('./config/logger');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// importamos rutas propias
const apiRoutes = require('./routes/api.routes');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Practica08',
      version: '1.0.0',
      description: 'Documentación de la API de Practica08 ',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', 
      },
    ],
  },
  apis: ['./src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const app = express();

app.use(express.json({
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf);
    } catch (error) {
      throw new SyntaxError('JSON inválido');
    }
  }
}));

// Capturo el error por si no fuera un json, ya que aunque lo he montado
// como un middleware con isJsonValid, no me había dado cuenta que app ya parsea
// el body a JSON, así que tengo que tratar el error antes de los middlewares
// mas para poder cambiar el status de error de 500 a 400. Como dice Mario
// el back no va a reconocer un error si el usuario no sabe pasar un json valido ;)
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.message === 'JSON inválido') {
    logger.error('Body JSON inválido');
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  next(err);
});



app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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