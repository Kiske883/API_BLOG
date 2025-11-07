const logger = require('../config/logger');
const AuthorModel = require('../models/author.model');

const checkAuthorId = async (req, res, next) => {
    const { authorId } = req.params;

    // Si no es numero rompo la ejecucion
    if ( isNaN(authorId)) {
        logger.error(`El id : ${authorId} no es numérico`);
        return res.status(400).json({message:`El id : ${authorId} no es numérico`}) ;
    }

    const author = await AuthorModel.getById(authorId);
    if (!author) {
        logger.error(`El id : ${authorId} no localizado`);
        return res.status(400).json({message:`El id : ${authorId} no localizado`}) ;
    }
    next();
}

module.exports = checkAuthorId;