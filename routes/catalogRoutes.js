const { Router } = require('express');
const { CatalogController } = require('../controllers/catalogController');

const catalog = Router();
const ctrl = new CatalogController();

catalog.get('/', (req, res) => ctrl.filter(req, res));
catalog.get('/:code', (req, res) => ctrl.findByCode(req, res));

module.exports = { catalog };