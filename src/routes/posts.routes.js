const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const checkAuthorId = require('../middlewares/authors.middlewares');
const { checkPostId, checkCategoriaId, checkAutorId, checkRequiredFields } = require('../middlewares/posts.middlewares');

router.get('/', postsController.getAll);
router.get('/:postId', checkPostId, postsController.getById);

// Mario : Me veo obligado a utilizar /author ya que si no me entraria siempre en el de arriba 
// al compartir un id numérico, no se si es buena praxis :S, no le veo otra por eso
router.get('/author/:authorId', checkAuthorId, postsController.getPostsByAuthor);

router.post('/', checkCategoriaId, checkAutorId, checkRequiredFields(['titulo', 'descripcion'], true), postsController.create);

// Utilizo checkAutorId y no checkAuthorId, por que uno lo recupera de params y otro de body
router.put('/:postId', checkPostId, checkCategoriaId, checkAutorId, checkRequiredFields(['titulo', 'descripcion'], false), postsController.updateById);

router.delete('/:postId', checkPostId, postsController.deleteById);

module.exports = router;