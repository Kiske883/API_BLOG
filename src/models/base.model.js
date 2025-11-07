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

  async getPaginated({ page = 1, perPage = 10, orderBy = null, whereSql = '', params = [] } = {}) {

    const limit = Number(perPage);
    const offset = (Number(page) - 1) * limit;
    const total = await this.getCount(whereSql, params);

    let sqlQuery = `SELECT * FROM \`${this.table}\` ${whereSql}`;

    if (orderBy) sqlQuery += ` ORDER BY ${orderBy}`;

    sqlQuery += ` LIMIT ? OFFSET ?`;

    const allParams = [...params, limit, offset];
    const [result] = await pool.query(sqlQuery, allParams);

    return {
      data: result,
      meta: { total, page: Number(page), perPage: Number(perPage), totalPages: Math.ceil(total / perPage) }
    };

  }
}

module.exports = BaseModel;