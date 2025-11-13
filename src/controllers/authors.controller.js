const AuthorModel = require('../models/author.model');
const logger = require('../config/logger');

/**
 * @swagger
 * /authors:
 *   get:
 *     tags:
 *       - Authors
 *     summary: Obtiene la lista de todos los autores paginada
 *     description: Devuelve un listado de autores con paginación, ordenado por id descendente.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página a devolver
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de elementos por página
 *     responses:
 *       200:
 *         description: Lista de autores obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Lluis Alsina"
 *                   email:
 *                     type: string
 *                     example: "lalsina@gmail.com"
 *                   imagen:
 *                     type: string
 *                     example: "https://example.com/avatar.jpg"
 *       500:
 *         description: Error interno del servidor
 */
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

/**
 * @swagger
 * /authors/{authorId}:
 *   get:
 *     tags:
 *       - Authors
 *     summary: Obtiene un autor por su ID
 *     description: |
 *       Devuelve los datos de un autor específico.
 *       La respuesta siempre tiene la estructura "data: [...]" para consistencia.
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del autor a consultar
 *     responses:
 *       200:
 *         description: Autor encontrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: "Lluis Alsina"
 *                       email:
 *                         type: string
 *                         example: "lalsina@gmail.com"
 *                       imagen:
 *                         type: string
 *                         example: "https://example.com/avatar.jpg"
 *       404:
 *         description: Autor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Autor no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
const getById = async (req, res, next) => {

  try {

    const result = await AuthorModel.getById(req.params.authorId);
    if (!result) return res.status(404).json({ message: 'Autor no encontrado' });

    // Mario se que comentaste que cuanto más sencilla la respuesta mejor, pero
    // soy partidario que las respuestas han de tener todas la misma estructura para facilitarles
    // el trabajo a front, con lo que todas las respuestas tendran los datos en data y algunas
    // tendran un array meta con datos específicos de cada función si los necesitara

    res.status(200).json({
      data: [result]
    });

  } catch (error) {
    logger.error(error);
    next(error);
  }
};

/**
 * @swagger
 * /authors:
 *   post:
 *     tags:
 *       - Authors
 *     summary: Crea un nuevo autor
 *     description: |
 *       Crea un autor en la base de datos.
 *       La respuesta siempre tiene la estructura "data: [...]" para consistencia.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - imagen
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Lluis Alsina"
 *                 description: Nombre completo del autor
 *               email:
 *                 type: string
 *                 example: "lalsina@gmail.com"
 *                 description: Correo electrónico del autor
 *               imagen:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *                 description: URL de la imagen del autor
 *     responses:
 *       200:
 *         description: Autor creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: "Lluis Alsina"
 *                       email:
 *                         type: string
 *                         example: "lalsina@gmail.com"
 *                       imagen:
 *                         type: string
 *                         example: "https://example.com/avatar.jpg"
 *       400:
 *         description: Error en los datos enviados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El campo email es obligatorio"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
const create = async (req, res, next) => {

  try {

    const { nombre, email, imagen } = req.body;
    const { insertId } = await AuthorModel.create({ nombre, email, imagen });
    const result = await AuthorModel.getById(insertId);

    res.status(200).json({
      data: [result]
    });

  } catch (error) {
    logger.error(error);
    next(error);
  }
};

/**
 * @swagger
 * /authors/{authorId}:
 *   put:
 *     tags:
 *       - Authors
 *     summary: Actualiza un autor existente
 *     description: |
 *       Actualiza los datos de un autor específico.
 *       La respuesta siempre tiene la estructura "data: [...]" para consistencia.
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del autor a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Lluis Alsina"
 *                 description: Nuevo nombre del autor
 *               email:
 *                 type: string
 *                 example: "lalsina@gmail.com"
 *                 description: Nuevo email del autor
 *               imagen:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *                 description: Nueva URL de la imagen del autor
 *     responses:
 *       200:
 *         description: Autor actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: "Lluis Alsina"
 *                       email:
 *                         type: string
 *                         example: "lalsina@gmail.com"
 *                       imagen:
 *                         type: string
 *                         example: "https://example.com/avatar.jpg"
 *       404:
 *         description: Autor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Author no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
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
      data: [result]
    });

  } catch (error) {
    logger.error(error);
    next(error);
  }
};

/**
 * @swagger
 * /authors/{authorId}:
 *   delete:
 *     tags:
 *       - Authors
 *     summary: Elimina un autor existente
 *     description: |
 *       Elimina un autor específico de la base de datos.
 *       La respuesta siempre tiene la estructura "data: [...]" para consistencia.
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del autor a eliminar
 *     responses:
 *       200:
 *         description: Autor eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: "Lluis Alsina"
 *                       email:
 *                         type: string
 *                         example: "lalsina@gmail.com"
 *                       imagen:
 *                         type: string
 *                         example: "https://example.com/avatar.jpg"
 *       404:
 *         description: Autor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Autor no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
const deleteById = async (req, res, next) => {
  try {

    const { authorId } = req.params;
    const result = await AuthorModel.getById(authorId);
    const ok = await AuthorModel.deleteById(authorId);

    if (!ok) return res.status(404).json({ message: 'Autor no encontrado' });

    res.status(200).json({
      data: [result]
    });

  } catch (error) {
    logger.error(error);
    next(error);
  }
};


module.exports = { getAll, getById, create, updateById, deleteById }