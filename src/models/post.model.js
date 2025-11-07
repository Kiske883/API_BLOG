const BaseModel = require('./base.model');
const pool = require('../config/db');
const logger = require('../config/logger');

class PostModel extends BaseModel {

  constructor() {
    super('posts');
  }

  async getAllWithAuthor({ limit, offset, orderBy } = {}) {

    let sqlQuery = `SELECT p.id, p.titulo, p.descripcion, p.created_at, p.categoria, p.autor_id,
                           a.nombre as autor_nombre, a.email as autor_email, a.imagen as autor_imagen
                    FROM posts p
                    LEFT JOIN autores a ON p.autor_id = a.id`;

    if (orderBy) sqlQuery += ` ORDER BY ${orderBy}`;

    if (limit) sqlQuery += ` LIMIT ?${offset ? ' OFFSET ?' : ''}`;

    try {
      const params = [];

      if (limit) params.push(Number(limit));
      if (limit && offset) params.push(Number(offset));

      const [rows] = await pool.query(sqlQuery, params);

      return rows.map(r => ({
        id: r.id,
        titulo: r.titulo,
        descripcion: r.descripcion,
        created_at: r.created_at,
        categoria: r.categoria,
        autor: {
          id: r.autor_id,
          nombre: r.autor_nombre,
          email: r.autor_email,
          imagen: r.autor_imagen
        }
      }));

    } catch (err) {
      logger.error('getAllWithAuthor error: %s', err.message);
      throw err;
    }
  }

  async getByIdWithAuthor(postId) {

    const sqlQuery = `SELECT p.id, p.titulo, p.descripcion, p.created_at, p.categoria, p.autor_id,
                            a.nombre as autor_nombre, a.email as autor_email, a.imagen as autor_imagen
                      FROM posts p
                      LEFT JOIN autores a ON p.autor_id = a.id
                      WHERE p.id = ?`;

    try {

      const [rows] = await pool.query(sqlQuery, [postId]);
      const result = rows[0];

      if (!result) return null;

      return {
        id: r.id,
        titulo: r.titulo,
        descripcion: r.descripcion,
        created_at: r.created_at,
        categoria: r.categoria,
        autor: {
          id: r.autor_id,
          nombre: r.autor_nombre,
          email: r.autor_email,
          imagen: r.autor_imagen
        }
      };

    } catch (error) {

      logger.error('getByIdWithAuthor error: %s', error.message);
      throw error;
    }
  }

  async create({ titulo, descripcion, categoria, autor_id }) {
    try {
      const [result] = await pool.query(
        'INSERT INTO posts (titulo, descripcion, categoria, autor_id) VALUES (?, ?, ?, ?)',
        [titulo, descripcion, categoria, autor_id]
      );

      return { id: result.insertId, titulo, descripcion, categoria, autor_id };

    } catch (err) {
      logger.error('PostModel.create error: %s', err.message);
      throw err;
    }
  }

  async getByAuthor(authorId, { page = 1, perPage = 10 } = {}) {

    const whereSql = 'WHERE p.autor_id = ?';
    const countSql = `SELECT COUNT(*) as total FROM posts p ${whereSql}`;
    const params = [authorId];
    const limit = Number(perPage);
    const offset = (Number(page) - 1) * limit;
    
    try {

      const [countRows] = await pool.query(countSql, params);
      const total = countRows[0].total || 0;

      const sql = `SELECT p.id, p.titulo, p.descripcion, p.created_at, p.categoria
                   FROM posts p
                   ${whereSql}
                   ORDER BY p.created_at DESC
                   LIMIT ? OFFSET ?`;
                   
      const allParams = [...params, limit, offset];
      const [rows] = await pool.query(sql, allParams);

      return {
        data: rows,
        meta: {
          total,
          page: Number(page),
          perPage: Number(perPage),
          totalPages: Math.ceil(total / perPage)
        }
      };

    } catch (err) {
      logger.error('PostModel.getByAuthor error: %s', err.message);
      throw err;
    }
  }
}

module.exports = new PostModel();