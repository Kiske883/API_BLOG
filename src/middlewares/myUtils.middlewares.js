// MArio no se si sería buena praxis, 
// La intencion en este caso es tener un middleware genérico que pudiera utilizar en varias routes diferentes
// por ejemplo validacion de email, telefono, y teniendo en cuenta que algunas peticiones puede estar en el campo email
// y en otras el campo email_cliente, etc ... 
const authorModel = require("../models/author.model");
const logger = require('../config/logger');

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email);
}

async function emailExists(email, fieldName, id) {
  try {

    let result = null;

    result = await authorModel.getByEmail(email, fieldName, id);

    return !!result;
  } catch (error) {

    logger.error(`Error comprobando email : ${error.message}`);
    return false;
  }
}

function validateEmail(fieldName) {
  return async (req, res, next) => {

    if (!req.body) {
      return res.status(400).json({ error: 'No hay datos en el body' });
    }

    const email = req.body[fieldName];

    if (email && !isValidEmail(email)) {
      return res.status(400).json({ error: `El campo ${fieldName} tiene un email inválido` });
    }

    next();
  };
}

function existsEmail(fieldName, myId = '') {
  return async (req, res, next) => {
    
    // Con esto consigo el id que voy a actualizar
    const id = req.params[myId] ;

    if (!req.body) {
      return res.status(400).json({ error: 'No hay datos en el body' });
    }

    const email = req.body[fieldName];

    if (await emailExists(email, fieldName, id)) {
      // Doy un mensaje genérico para no dar excesivas pistas que es un email existente
      return res.status(400).json({ error: `El email ${email} no es válido` });
    }

    next();
  };
}

const checkAuthorId = async (req, res, next) => {

  const { authorId } = req.params;

  if (isNaN(authorId)) {
    logger.error(`El id : ${authorId} no es numérico`);
    return res.status(400).json({ message: `El id : ${authorId} no es numérico` });
  }

  const author = await authorModel.getById(authorId);
  if (!author) {
    logger.error(`El id : ${authorId} no localizado`);
    return res.status(400).json({ message: `El id : ${authorId} no localizado` });
  }
  next();
}

// Mario : Se que no la utilizo, ya que lo controlo desde app.js, pero como myUtils es una libreria de funcionalidades
// pues nunca sobra por si fuera necesaria más adelante
function isJsonValid(req, res, next) {
  try {
    
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      logger.warn(`Petición con Content-Type inválido: ${contentType || 'no especificado'}`);
      return res.status(400).json({ error: 'El Content-Type debe ser application/json' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      logger.warn('Body vacío o inexistente en la petición');
      return res.status(400).json({ error: 'El cuerpo JSON está vacío o no se ha enviado' });
    }

    next();

  } catch (error) {
    logger.error(`Error validando JSON: ${error.message}`);
    res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
}

module.exports = { validateEmail, isValidEmail, checkAuthorId, existsEmail, isJsonValid };