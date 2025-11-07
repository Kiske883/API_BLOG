const logger = require('../config/logger');
const PostModel = require('../models/post.model');

const checkPostId = async (req, res, next) => {
    const { postId } = req.params;

    // Si no es numero rompo la ejecucion
    if ( isNaN(postId)) {
        logger.error(`El id : ${postId} no es numérico`);
        return res.status(400).json({message:`El id : ${postId} no es numérico`}) ;
    }

    const post = await PostModel.getById(postId);
    if (!post) {
        logger.error(`El id : ${postId} no localizado`);
        return res.status(400).json({message:`El id : ${postId} no localizado`}) ;
    }
    next();
}

module.exports = checkPostId;