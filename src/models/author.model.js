const BaseModel = require('./base.model');
const pool = require('../config/db');
const logger = require('../config/logger');

class AuthorModel extends BaseModel {
  constructor() {
    super('autores');
  }

  async getById(id) {
    try {
        
      logger.info(`Entro en author.model.js getById pasandole ${id}`) ;
      const [rows] = await pool.query('SELECT id, nombre, email, imagen FROM autores WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (err) {
      logger.error('AutorModel.getById error: %s', err.message);
      throw err;
    }
  }

  async create({ nombre, email, imagen }) {
    try {
      const [result] = await pool.query('INSERT INTO autores (nombre, email, imagen) VALUES (?, ?, ?)', [nombre, email, imagen]);
      return { id: result.insertId, nombre, email, imagen };
    } catch (err) {
      logger.error('AutorModel.create error: %s', err.message);
      throw err;
    }
  }

  async updateById(id, { nombre, email, imagen }) {
    try {
      const [result] = await pool.query('UPDATE autores SET nombre = ?, email = ?, imagen = ? WHERE id = ?', [nombre, email, imagen, id]);
      return result.affectedRows > 0;
    } catch (err) {
      logger.error('AutorModel.update error: %s', err.message);
      throw err;
    }
  }

  async deleteById(id) {
    try {
      const [result] = await pool.query('DELETE FROM autores WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (err) {
      logger.error('AutorModel.delete error: %s', err.message);
      throw err;
    }
  }
}

module.exports = new AuthorModel();
