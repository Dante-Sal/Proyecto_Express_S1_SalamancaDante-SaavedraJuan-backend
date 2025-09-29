const { Router } = require('express');
const { RateLimiting } = require('../config/rateLimiting');
const { CatalogController } = require('../controllers/catalogController');

const catalog = Router();
const ctrl = new CatalogController();

catalog.get('/', RateLimiting.catalogFilterLimiter, ctrl.filter);
catalog.get('/:code', RateLimiting.catalogfindByCodeLimiter, ctrl.findByCode);

module.exports = { catalog };