const pool = require('../config/db');
const logger = require('../config/logger');

class BaseModel {

  constructor(table) {

    if (!table) throw new Error('El nombre de la tabla es requerido');
    this.table = table;

  }

  async getAll({ limit, offset, orderBy } = {}) {

    let sqlQuery = `SELECT * FROM \`${this.table}\``;

    if (orderBy) sqlQuery += ` ORDER BY ${orderBy}`;
    if (limit) sqlQuery += ` LIMIT ?${offset ? ' OFFSET ?' : ''}`;

    const params = [];

    if (limit) params.push(Number(limit));
    if (limit && offset) params.push(Number(offset));

    const [rows] = await pool.query(sqlQuery, params);

    return rows;
  }

  async getCount(whereSql = '', params = []) {

    const sqlQuery = `SELECT COUNT(*) as total FROM \`${this.table}\` ${whereSql}`;
    const [rows] = await pool.query(sqlQuery, params);

    return rows[0].total || 0;

  }

  async getByEmail(email, fieldName, id = null) {

    try {
      let query = `SELECT * FROM \`${this.table}\` WHERE ${fieldName} = ?`;
      const params = [email];

      // Este condicional distingue si estamos en un UPDATE o en un CREATE.
      // Si se proporciona un 'id', significa que estamos actualizando un registro existente,
      // así que la consulta buscará si el email ya existe en otro autor (excluyendo el actual).
      // Si no hay 'id', significa que estamos creando un nuevo autor,
      // y la consulta comprobará simplemente si el email ya existe en la tabla.
      if (id !== null && id !== undefined) {
        query += ` AND id <> ?`;
        params.push(id);
      }

      const [rows] = await pool.query(query, params);
      return rows[0];

    } catch (error) {
      logger.error(`Error en getByEmail: ${error.message}`);
      throw error;
    }

  }

  async getPaginated({ page = 1, perPage = 10, orderBy = null, whereSql = '', params = [] } = {}) {

    const limit = Number(perPage);
    const offset = (Number(page) - 1) * limit;
    const total = await this.getCount(whereSql, params);

    let sqlQuery = `SELECT * FROM ${this.table} origin`;

    sqlQuery += `${whereSql}`;

    if (orderBy) sqlQuery += ` ORDER BY ${orderBy}`;

    sqlQuery += ` LIMIT ? OFFSET ?`;

    const allParams = [...params, limit, offset];
    const [result] = await pool.query(sqlQuery, allParams);

    return {
      data: result,
      meta: { total, page: Number(page), perPage: Number(perPage), totalPages: Math.ceil(total / perPage) }
    };

  }

  async deleteById(id) {

    try {

      const [result] = await pool.query(`DELETE FROM \`${this.table}\` WHERE id = ?`, [id]);
      return result.affectedRows > 0;

    } catch (error) {
      logger.error('BaseModel.deleteById error: %s', error.message);
      throw error;
    }
  }

}

module.exports = BaseModel;