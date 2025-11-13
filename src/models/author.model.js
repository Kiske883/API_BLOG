const BaseModel = require('./base.model');
const pool = require('../config/db');
const logger = require('../config/logger');

class AuthorModel extends BaseModel {

  constructor() {
    super('autores');
  }

  async getById(id) {

    try {

      const [result] = await pool.query(`SELECT id, 
                                                nombre, 
                                                email, 
                                                imagen 
                                        FROM autores 
                                        WHERE id = ?`, [id]);

      return result[0] || null;

    } catch (error) {
      logger.error('AutorModel.getById error: %s', error.message);
      throw error;
    }
  }

  async create({ nombre, email, imagen }) {

    try {
      const [result] = await pool.query('INSERT INTO autores ( nombre, email, imagen ) VALUES ( TRIM(?), TRIM(?), TRIM(?)) ', [nombre, email, imagen]);

      return result;

    } catch (error) {
      logger.error('AutorModel.create error: %s', error.message);
      throw error;
    }
  }

  async updateById(id, { nombre, email, imagen }) {

    try {

      const [result] = await pool.query(`UPDATE autores SET nombre = TRIM(?), 
                                                            email = TRIM(?), 
                                                            imagen = TRIM(?) WHERE id = ?`, [nombre, email, imagen, id]);

      return result;

    } catch (error) {

      if (error.code === 'ER_DUP_ENTRY') {
        logger.warn(`Intento de actualizar con un email duplicado: ${email}`);
        throw new Error('El email ya está registrado por otro autor.');
      }
      logger.error('AutorModel.update error: %s', error.message);
      throw error;
    }
  }

}

module.exports = new AuthorModel();
