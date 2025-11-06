const AuthorModel = require('../models/author.model');
const logger = require('../config/logger');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10 } = req.query;
    const result = await AuthorModel.getPaginated({ page, perPage, orderBy: 'id DESC' });
    res.json(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const autor = await AuthorModel.getById(req.params.authorId);
    if (!autor) return res.status(404).json({ message: 'Autor no encontrado' });
    res.json(autor);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { nombre, email, imagen } = req.body;
    const newAutor = await AuthorModel.create({ nombre, email, imagen });
    res.status(201).json(newAutor);
  } catch (err) {
    next(err);
  }
};

const updateById = async (req, res, next) => {
  try {
    const { nombre, email, imagen } = req.body;
    const ok = await AuthorModel.update(req.params.id, { nombre, email, imagen });
    if (!ok) return res.status(404).json({ message: 'Autor no encontrado' });
    res.json({ message: 'Actualizado' });
  } catch (err) {
    next(err);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const ok = await AuthorModel.delete(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Autor no encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, updateById, deleteById }