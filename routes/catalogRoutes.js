const { Router } = require('express');
const { Authorization } = require('../middlewares/authorizationMiddlewares');
const { CatalogController } = require('../controllers/catalogController');

const catalog = Router();
const auth = new Authorization();
const ctrl = new CatalogController();

catalog.get('/', ctrl.filter);
catalog.get('/:code', ctrl.findByCode);

module.exports = { catalog };