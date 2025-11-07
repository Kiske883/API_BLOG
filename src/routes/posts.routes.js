const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const checkAuthorId = require('../middlewares/authors.middlewares');
const checkPostId = require('../middlewares/posts.middlewares');

router.get('/', postsController.getAll);
router.get('/:postId', checkPostId, postsController.getById);

// Mario : Me veo obligado a utilizar /author ya que si no me entraria siempre en el de arriba 
// al compartir un id numérico, no se si es buena praxis :S, no le veo otra por eso

// Voy a reutilizar el authors.middleware, me chirria ya que estoy en Posts, pero es que me cuadra
// con lo que necesito, sea numérico y que además exista en autores
router.get('/author/:authorId',checkAuthorId, postsController.getPostsByAuthor);

router.post('/', postsController.create);

router.delete('/:postId', checkPostId, postsController.create);

module.exports = router;