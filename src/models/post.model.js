const BaseModel = require('./base.model');
const pool = require('../config/db');
const logger = require('../config/logger');

class PostModel extends BaseModel {

  constructor() {
    super('posts');
  }

  async getAllWithAuthor({ page = 1, perPage = 10, orderBy = null, whereSql = '', params = [] } = {}) {

    const limit = Number(perPage);
    const offset = (Number(page) - 1) * limit;
    const total = await this.getCount(whereSql, params);

    let sqlQuery = `SELECT 
                            p.id, 
                            p.titulo, 
                            p.descripcion, 
                            p.created_at, 
                            p.categoria_id, 
                            c.descripcion AS categoria, 
                            p.autor_id,
                            a.nombre AS autor_nombre, 
                            a.email AS autor_email, 
                            a.imagen AS autor_imagen
                    FROM posts p
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    LEFT JOIN autores a ON p.autor_id = a.id `;

    if (orderBy) sqlQuery += ` ORDER BY ${orderBy}`;

    if (limit) sqlQuery += ` LIMIT ?${offset ? ' OFFSET ?' : ''}`;

    try {
      // const params = [];

      if (limit) params.push(Number(limit));
      if (limit && offset) params.push(Number(offset));

      const [rows] = await pool.query(sqlQuery, params);

      const formatted = rows.map(r => ({
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

      return {
        data: formatted,
        meta: { total, page: Number(page), perPage: Number(perPage), totalPages: Math.ceil(total / perPage) }
      };

    } catch (error) {
      logger.error('getAllWithAuthor error: %s', error.message);
      throw error;
    }
  }

  async getByIdWithAuthor(postId) {

    const sqlQuery = `SELECT  p.id, 
                              p.titulo, 
                              p.descripcion, 
                              p.created_at, 
                              c.descripcion as categoria, 
                              p.autor_id,
                              a.nombre as autor_nombre, 
                              a.email as autor_email, 
                              a.imagen as autor_imagen
                      FROM posts p
                      LEFT JOIN autores a ON p.autor_id = a.id
                      LEFT JOIN categorias c ON p.categoria_id = c.id
                      WHERE p.id = ?`;

    try {

      const [rows] = await pool.query(sqlQuery, [postId]);
      const result = rows[0];

      if (!result) return null;

      return {
        id: result.id,
        titulo: result.titulo,
        descripcion: result.descripcion,
        created_at: result.created_at,
        categoria: result.categoria,
        autor: {
          id: result.autor_id,
          nombre: result.autor_nombre,
          email: result.autor_email,
          imagen: result.autor_imagen
        }
      };

    } catch (error) {

      logger.error('getByIdWithAuthor error: %s', error.message);
      throw error;
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

      const sql = `SELECT p.id, 
                          p.titulo, 
                          p.descripcion, 
                          p.created_at, 
                          c.descripcion as categoria
                   FROM posts p
                   inner join categorias c on ( c.id = p.categoria_id )
                   ${whereSql}
                   ORDER BY p.created_at DESC
                   LIMIT ? OFFSET ?`;

      const allParams = [...params, limit, offset];
      const [result] = await pool.query(sql, allParams);

      return {
        data: result,
        meta: {
          total,
          page: Number(page),
          perPage: Number(perPage),
          totalPages: Math.ceil(total / perPage)
        }
      };

    } catch (error) {
      logger.error('PostModel.getByAuthor error: %s', error.message);
      throw error;
    }
  }

  async create({ titulo, descripcion, categoria_id, autor_id }) {

    try {
      const [result] = await pool.query(
        ` INSERT INTO posts (  titulo,
                               descripcion, 
                               categoria_id, 
                               autor_id ) 
          VALUES ( TRIM(?), TRIM(?), ?, ?) `,
        [titulo, descripcion, categoria_id, autor_id]
      );

      return { id: result.insertId, titulo, descripcion, categoria_id, autor_id };

    } catch (error) {
      logger.error('PostModel.create error: %s', error.message);
      throw error;
    }
  }

  async updateById(id, { titulo, descripcion, categoria_id, autor_id }) {

    try {

      const [result] = await pool.query(
        'UPDATE posts SET titulo = TRIM(?), ' +
        '                 descripcion = TRIM(?), ' +
        '                 categoria_id = ? , ' +
        '                 autor_id = ? ' +
        'WHERE id = ?', [titulo, descripcion, categoria_id, autor_id, id]);

      return result;

    } catch (err) {
      logger.error('AutorModel.update error: %s', err.message);
      throw err;
    }
  }
}

module.exports = new PostModel();