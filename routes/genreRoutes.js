const express = require('express');
const { validateCreateGenre, validateUpdateGenre, validateGenre } = require('../utils/validators');
const { verifyToken } = require('../middlewears/checkToken')
const { getGenres, createGenre, updateGenre, deleteGenre, getGenreById } = require('../controllers/genreController');
const router = express.Router();

router.get('/', getGenres);
router.get('/:id', [ verifyToken, validateGenre() ] , getGenreById);
router.post('/', [ verifyToken, validateCreateGenre() ] , createGenre);
router.put('/:id', [ verifyToken, validateUpdateGenre() ] , updateGenre);
router.delete('/:id', [ verifyToken, validateGenre() ] , deleteGenre);

module.exports = router;
