const { Router } = require('express');
const { UserController } = require('../controllers/userController');

const users = Router();
const ctrl = new UserController();

users.post('/register', (req, res) => ctrl.register(req, res));

module.exports = { users };