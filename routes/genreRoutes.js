const { Router } = require('express');
const { Authorization } = require('../middlewares/authorizationMiddlewares');
const { GenreController } = require('../controllers/genreController');

const genres = Router();
const auth = new Authorization();
const ctrl = new GenreController();

genres.get('/', ctrl.list);

module.exports = { genres };