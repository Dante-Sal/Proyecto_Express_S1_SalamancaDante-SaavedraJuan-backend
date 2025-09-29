const { Router } = require('express');
const { RateLimiting } = require('../config/rateLimiting');
const { GenreController } = require('../controllers/genreController');

const genres = Router();
const ctrl = new GenreController();

genres.get('/', RateLimiting.genreListLimiter, ctrl.list);

module.exports = { genres };