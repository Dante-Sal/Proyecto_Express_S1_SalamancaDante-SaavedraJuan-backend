const { Router } = require('express');
const { GenreController } = require('../controllers/genreController');

const genres = Router();
const ctrl = new GenreController();

genres.get('/', (req, res) => ctrl.list(req, res));

module.exports = { genres };