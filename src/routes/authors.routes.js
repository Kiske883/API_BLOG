const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authors.controller');
const checkAuthorId = require('../middlewares/authors.middlewares');

router.get('/', authorController.getAll); 
router.get('/:authorId', checkAuthorId, authorController.getById);
router.post('/', authorController.create);
router.put('/:authorId', checkAuthorId, authorController.updateById);
router.delete('/:authorId', checkAuthorId, authorController.deleteById);

module.exports = router;
