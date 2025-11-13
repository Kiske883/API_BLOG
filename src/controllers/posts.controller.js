const PostModel = require('../models/post.model');
const AuthorModel = require('../models/author.model');
const logger = require('../config/logger');

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtiene todos los posts con sus autores
 *     description: |
 *       Devuelve un listado paginado de posts junto con la información de sus autores.
 *       La respuesta siempre tiene la estructura "data: [...]" para consistencia.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: perPage
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de posts por página
 *     responses:
 *       200:
 *         description: Listado de posts con autores
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
 *                       titulo:
 *                         type: string
 *                         example: "Primer post"
 *                       contenido:
 *                         type: string
 *                         example: "Contenido del post"
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nombre:
 *                             type: string
 *                             example: "Lluis Alsina"
 *                           email:
 *                             type: string
 *                             example: "lalsina@gmail.com"
 *                           imagen:
 *                             type: string
 *                             example: "https://example.com/avatar.jpg"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     perPage:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 50
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
const getAll = async (req, res, next) => {

  try {
    const { page = 1, perPage = 10 } = req.query;

    const result = await PostModel.getAllWithAuthor({ page, perPage, orderBy: 'p.id DESC' });
    if (!result.data || result.data.length === 0) {
      return res.json({ data: [] });
    }

    res.json(result);

  } catch (error) {
    logger.error(error);
    next(error);
  }

};

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Obtiene un post por su ID
 *     description: |
 *       Devuelve un post específico junto con la información de su autor.
 *       La respuesta siempre tiene la estructura "data: [...]" para consistencia.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post a consultar
 *     responses:
 *       200:
 *         description: Post encontrado correctamente
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
 *                       titulo:
 *                         type: string
 *                         example: "Primer post"
 *                       contenido:
 *                         type: string
 *                         example: "Contenido del post"
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nombre:
 *                             type: string
 *                             example: "Lluis Alsina"
 *                           email:
 *                             type: string
 *                             example: "lalsina@gmail.com"
 *                           imagen:
 *                             type: string
 *                             example: "https://example.com/avatar.jpg"
 *       404:
 *         description: Post no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post no encontrado"
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

    const result = await PostModel.getByIdWithAuthor(req.params.postId);

    if (!result) return res.status(404).json({ message: 'Post no encontrado' });

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
 * /authors/{authorId}/posts:
 *   get:
 *     summary: Obtiene los posts de un autor específico
 *     description: |
 *       Devuelve un listado paginado de posts de un autor específico.
 *       La respuesta siempre tiene la estructura "data: [...]" para consistencia.
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del autor cuyos posts se quieren consultar
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: perPage
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de posts por página
 *     responses:
 *       200:
 *         description: Listado de posts del autor
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
 *                       titulo:
 *                         type: string
 *                         example: "Primer post"
 *                       contenido:
 *                         type: string
 *                         example: "Contenido del post"
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nombre:
 *                             type: string
 *                             example: "Lluis Alsina"
 *                           email:
 *                             type: string
 *                             example: "lalsina@gmail.com"
 *                           imagen:
 *                             type: string
 *                             example: "https://example.com/avatar.jpg"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     perPage:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 20
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
const getPostsByAuthor = async (req, res, next) => {
  
  try {

    const { authorId } = req.params;
    const { page = 1, perPage = 10 } = req.query;
    const autor = await AuthorModel.getById(authorId);

    if (!autor) return res.status(404).json({ message: 'Autor no encontrado' });

    const result = await PostModel.getByAuthor(authorId, { page, perPage });

    res.json(result);

  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crea un nuevo post
 *     description: |
 *       Crea un nuevo post y lo asocia a un autor existente.
 *       La respuesta siempre tiene la estructura "data: [...]" para consistencia.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *               - categoria_id
 *               - autor_id
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Nuevo post"
 *                 description: Título del post
 *               descripcion:
 *                 type: string
 *                 example: "Descripción del post"
 *                 description: Contenido del post
 *               categoria_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID de la categoría a la que pertenece el post
 *               autor_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID del autor del post (debe existir)
 *     responses:
 *       200:
 *         description: Post creado correctamente
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
 *                       titulo:
 *                         type: string
 *                         example: "Nuevo post"
 *                       descripcion:
 *                         type: string
 *                         example: "Descripción del post"
 *                       categoria_id:
 *                         type: integer
 *                         example: 1
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nombre:
 *                             type: string
 *                             example: "Lluis Alsina"
 *                           email:
 *                             type: string
 *                             example: "lalsina@gmail.com"
 *                           imagen:
 *                             type: string
 *                             example: "https://example.com/avatar.jpg"
 *       400:
 *         description: Datos inválidos o autor no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Autor no existe"
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

    const { titulo, descripcion, categoria_id, autor_id } = req.body;
    const autor = await AuthorModel.getById(autor_id);

    if (!autor) return res.status(400).json({ message: 'Autor no existe' });

    const { id } = await PostModel.create({ titulo, descripcion, categoria_id, autor_id });
    const result = await PostModel.getByIdWithAuthor(id);

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
 * /posts/{postId}:
 *   put:
 *     summary: Actualiza un post existente
 *     description: |
 *       Actualiza los datos de un post específico y devuelve el post actualizado junto con su autor.
 *       La respuesta siempre tiene la estructura "data: [...]" para consistencia.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Post actualizado"
 *               descripcion:
 *                 type: string
 *                 example: "Descripción actualizada del post"
 *               categoria_id:
 *                 type: integer
 *                 example: 2
 *               autor_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID del autor del post (debe existir)
 *     responses:
 *       200:
 *         description: Post actualizado correctamente
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
 *                       titulo:
 *                         type: string
 *                         example: "Post actualizado"
 *                       descripcion:
 *                         type: string
 *                         example: "Descripción actualizada del post"
 *                       categoria_id:
 *                         type: integer
 *                         example: 2
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nombre:
 *                             type: string
 *                             example: "Lluis Alsina"
 *                           email:
 *                             type: string
 *                             example: "lalsina@gmail.com"
 *                           imagen:
 *                             type: string
 *                             example: "https://example.com/avatar.jpg"
 *       404:
 *         description: Post no encontrado
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

    const { titulo, descripcion, categoria_id, autor_id } = req.body;
    const { postId } = req.params;

    await PostModel.updateById(postId, { titulo, descripcion, categoria_id, autor_id });

    const result = await PostModel.getByIdWithAuthor(postId);

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
 * /posts/{postId}:
 *   delete:
 *     summary: Elimina un post existente
 *     description: |
 *       Elimina un post específico y devuelve la información del post eliminado.
 *       La respuesta siempre tiene la estructura "data: [...]" para consistencia.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post a eliminar
 *     responses:
 *       200:
 *         description: Post eliminado correctamente
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
 *                       titulo:
 *                         type: string
 *                         example: "Post eliminado"
 *                       descripcion:
 *                         type: string
 *                         example: "Contenido del post eliminado"
 *                       categoria_id:
 *                         type: integer
 *                         example: 2
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nombre:
 *                             type: string
 *                             example: "Lluis Alsina"
 *                           email:
 *                             type: string
 *                             example: "lalsina@gmail.com"
 *                           imagen:
 *                             type: string
 *                             example: "https://example.com/avatar.jpg"
 *       404:
 *         description: Post no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error postId : 5 no localizado"
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

    const { postId } = req.params;

    // Mario, ya estoy comprobando desde middleware que postId exista, pero no esta de más hacer una comprobacion 
    // por si se hubiera eliminado desde otros usuarios. Me lo pensaría por un tema de rendimiento, pero la 
    // query la tengo que hacer si o si, para recuperar los datos, con lo que el if de la comprobacion 
    // no tiene ningún coste

    const result = await PostModel.getByIdWithAuthor(postId);
    if (result) {
      const ok = await PostModel.deleteById(postId);

      if (!ok) return res.status(404).json({ message: `Error eliminado el post : ${postId}` });
    } else {
      res.status(404).json({ message: `Error postId : ${postId} no localizado` });
    }
    res.status(200).json({
      data: [result]
    });

  } catch (error) {
    logger.error(error);
    next(error);
  }
};

module.exports = { getAll, getById, getPostsByAuthor, create, updateById, deleteById }
