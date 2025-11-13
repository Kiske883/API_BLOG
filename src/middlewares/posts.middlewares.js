const logger = require('../config/logger');
const AuthorModel = require('../models/author.model');
const PostModel = require('../models/post.model');


const checkPostId = async (req, res, next) => {
  const { postId } = req.params;

  if (isNaN(postId)) {
    logger.error(`El postid : ${postId} no es numérico`);
    return res.status(400).json({ message: `El id : ${postId} no es numérico` });
  }

  const post = await PostModel.getByIdWithAuthor(postId);
  if (!post) {
    logger.error(`El postId : ${postId} no localizado`);
    return res.status(400).json({ message: `El id : ${postId} no localizado` });
  }

  next();
}

const checkAutorId = async (req, res, next) => {

  const { autor_id } = req.body;

  if (isNaN(autor_id)) {
    logger.error(`El autorId : ${autor_id} no es numérico`);
    return res.status(400).json({ message: `El autorId : ${autor_id} no es numérico` });
  }

  const autor = await AuthorModel.getById(autor_id);
  if (!autor) {
    logger.error(`El Autor con id : ${autor} no localizado`);
    return res.status(400).json({ message: `El id : ${autor} no localizado` });
  }

  next();
}

const checkCategoriaId = async (req, res, next) => {

  const { categoria_id } = req.body;

  if (isNaN(categoria_id)) {
    logger.error(`El categoria_id : ${categoria_id} no es numérico`);
    return res.status(400).json({ message: `El id : ${categoria_id} no es numérico` });
  }

  next();
}

function checkRequiredFields(campos = [], obligatorio = true) {

  return (req, res, next) => {

    if (!req.body || Object.keys(req.body).length === 0) {
      logger.error('El body de la petición está vacío');
      return res.status(400).json({ message: 'El body de la petición no puede estar vacío' });
    }

    for (const campo of campos) {

      const valor = req.body[campo];

      if (obligatorio) {

        if (valor === undefined || valor === null) {
          logger.error(`El campo ${campo} no está presente en el body`);
          return res.status(400).json({ message: `El campo ${campo} es obligatorio` });
        }
      }

      if (valor !== undefined && valor !== null) {
        if (typeof valor !== 'string' || valor.trim() === '') {
          logger.error(`El campo ${campo} está vacío o no es una cadena válida`);
          return res.status(400).json({ message: `El campo ${campo} no puede estar vacío` });
        }
      }
    }

    next();
  };
}

module.exports = { checkPostId, checkAutorId, checkCategoriaId, checkRequiredFields };