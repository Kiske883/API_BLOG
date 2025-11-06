const PostModel = require('../models/post.model');
const AuthorModel = require('../models/author.model');
const logger = require('../config/logger');

const getAll = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;

    if (page && perPage) {
      const pag = await PostModel.getPaginated({ page, perPage, orderBy: 'created_at DESC' });
      const limit = Number(perPage);
      const offset = (Number(page) - 1) * limit;
      const rows = await PostModel.getAllWithAuthor({ limit, offset, orderBy: 'p.created_at DESC' });
      const total = await PostModel.getCount('', []);
      return res.json({
        data: rows,
        meta: { total, page: Number(page), perPage: Number(perPage), totalPages: Math.ceil(total / perPage) }
      });
    }
    const rows = await PostModel.getAllWithAuthor();
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const post = await PostModel.findByIdWithAuthor(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { titulo, descripcion, categoria, autor_id } = req.body;
    
    const autor = await AuthorModel.findById(autor_id);
    if (!autor) return res.status(400).json({ message: 'Autor no existe' });

    const newPost = await PostModel.create({ titulo, descripcion, categoria, autor_id });
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};

const getPostsByAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, perPage = 10 } = req.query;

    const autor = await AuthorModel.findById(id);
    if (!autor) return res.status(404).json({ message: 'Autor no encontrado' });

    const result = await PostModel.getByAuthor(id, { page, perPage });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, getPostsByAuthor }
