const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authors.controller');
const { validateEmail, checkAuthorId, existsEmail } = require('../middlewares/myUtils.middlewares');


router.get('/', authorController.getAll); 
router.get('/:authorId', checkAuthorId, authorController.getById);

// Mario :  Verifico que el email sea un email valido, además miro que no exista en BBDD
// y dependiendo si es un update o un insert modifico el where de la query.
// Lo he montado con middleware, por intentar filtrar cuantas más peticiones posibles
// para que no lleguen al controller y mejorar rendimiento, pero si te he de ser sincero, yo lo hubiera delegado
// en BBDD que ya tiene el UNIQUE en email y lo unico que hubiera hecho es capturar el error
// para que no devuelva un 500, y tunearle yo la respuesta
router.post('/', validateEmail('email'), existsEmail('email'),authorController.create);

router.put('/:authorId', checkAuthorId, validateEmail('email'),  existsEmail('email','authorId'), authorController.updateById);
router.delete('/:authorId', checkAuthorId, authorController.deleteById);

module.exports = router;
