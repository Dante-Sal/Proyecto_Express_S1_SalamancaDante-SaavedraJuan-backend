const { Router } = require('express');
const { ReviewController } = require('../controllers/reviewController');

const reviews = Router();
const ctrl = new ReviewController();

reviews.get('/:id', ctrl.generateFile);

module.exports = { reviews };