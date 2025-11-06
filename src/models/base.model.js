const pool = require('../config/db');
const logger = require('../config/logger');

class BaseModel {
  constructor(table) {
    if (!table) throw new Error('Table name is required');
    this.table = table;
  }

  async getAll({ limit, offset, orderBy } = {}) {
    let sql = `SELECT * FROM \`${this.table}\``;
    if (orderBy) sql += ` ORDER BY ${orderBy}`;
    if (limit) sql += ` LIMIT ?${offset ? ' OFFSET ?' : ''}`;
    const params = [];
    if (limit) params.push(Number(limit));
    if (limit && offset) params.push(Number(offset));
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  async getCount(whereSql = '', params = []) {
    const sql = `SELECT COUNT(*) as total FROM \`${this.table}\` ${whereSql}`;
    const [rows] = await pool.query(sql, params);
    return rows[0].total || 0;
  }

  async getPaginated({ page = 1, perPage = 10, orderBy = null, whereSql = '', params = [] } = {}) {
    const limit = Number(perPage);
    const offset = (Number(page) - 1) * limit;
    const total = await this.getCount(whereSql, params);
    let sql = `SELECT * FROM \`${this.table}\` ${whereSql}`;
    if (orderBy) sql += ` ORDER BY ${orderBy}`;
    sql += ` LIMIT ? OFFSET ?`;
    const allParams = [...params, limit, offset];
    const [rows] = await pool.query(sql, allParams);
    return {
      data: rows,
      meta: { total, page: Number(page), perPage: Number(perPage), totalPages: Math.ceil(total / perPage) }
    };
  }
}

module.exports = BaseModel;