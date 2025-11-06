const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');

router.get('/', postsController.getAll);                 
router.get('/:postId', postsController.getById);               
router.post('/', postsController.create);              
router.get('/author/:postId', postsController.getPostsByAuthor);

module.exports = router;