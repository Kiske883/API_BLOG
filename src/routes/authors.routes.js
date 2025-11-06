const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authors.controller');

router.get('/', authorController.getAll); 
router.get('/:authorId', authorController.getById);
router.post('/', authorController.create);
router.put('/:authorId', authorController.updateById);
router.delete('/:authorId', authorController.deleteById);

module.exports = router;
