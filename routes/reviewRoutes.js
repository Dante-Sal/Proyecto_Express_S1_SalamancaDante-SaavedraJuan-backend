const { Router } = require('express');
const { ReviewController } = require('../controllers/reviewController');



reviews.get('/:id', ctrl.generateFile);

const reviews = Router();
const ctrl = new ReviewController();

module.exports = { reviews };