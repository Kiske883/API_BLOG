const AuthorModel = require('../models/author.model');
const logger = require('../config/logger');

const getAll = async (req, res, next) => {

  try {

    const { page = 1, perPage = 10 } = req.query;
    const result = await AuthorModel.getPaginated({ page, perPage, orderBy: 'id DESC' });

    res.json(result);

  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const getById = async (req, res, next) => {

  try {

    const result = await AuthorModel.getById(req.params.authorId);
    if (!result) return res.status(404).json({ message: 'Autor no encontrado' });
    
    // Mario se que comentaste que cuanto más sencilla la respuesta mejor, pero
    // soy partidario que las respuestas han de tener todas la misma estructura para facilitarles
    // el trabajo a front, con lo que todas las respuestas tendran los datos en data y algunas
    // tendran un array meta con datos específicos de cada función si los necesitara
    
    res.status(200).json({
      data: [ result ] });

  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const create = async (req, res, next) => {

  try {

    const { nombre, email, imagen } = req.body;
    const { insertId } = await AuthorModel.create({ nombre, email, imagen });
    const result = await AuthorModel.getById(insertId);


    res.status(200).json({
      data: [ result ] });

  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const updateById = async (req, res, next) => {

  try {

    const { nombre, email, imagen } = req.body;
    const { authorId } = req.params;

    await AuthorModel.updateById(authorId, { nombre, email, imagen });

    const result = await AuthorModel.getById(authorId);

    if (!result) {
      return res.status(404).json({ error: 'Author no encontrado' });
    }


    res.status(200).json({
      data: [ result ] });

  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {

    const { authorId } = req.params;
    const result = await AuthorModel.getById(authorId);
    const ok = await AuthorModel.deleteById(authorId);

    if (!ok) return res.status(404).json({ message: 'Autor no encontrado' });

    res.status(200).json(result);

  } catch (error) {
    logger.error(error);
    next(error);
  }
};

module.exports = { getAll, getById, create, updateById, deleteById }