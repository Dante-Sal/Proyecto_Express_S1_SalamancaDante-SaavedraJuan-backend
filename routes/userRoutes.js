const { Router } = require('express');
const { UserController } = require('../controllers/userController');

const users = Router();
const ctrl = new UserController();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registro de usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/hola'
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en los datos enviados
 */
users.post('/register', (req, res) => ctrl.register(req, res));
users.post('/login', (req, res) => ctrl.signIn(req, res));

module.exports = { users };