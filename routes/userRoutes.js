require('dotenv').config();
const { Router } = require('express');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { UserController } = require('../controllers/userController');

const users = Router();
const ctrl = new UserController();

passport.use(new Strategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
        try {
            return done(null, payload);
        } catch (err) {
            return done(err, false);
        };
    }
));

const authMiddleware = (req, res, next) => passport.authenticate(`jwt`, { session: false }, (err, user, info) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: `acceso denegado (fallo en la autenticación por token de acceso)`, info: info.message });

    req.user = user;
    next();
})(req, res, next);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - _id
 *         - first_name
 *         - first_surname
 *         - email
 *         - username
 *         - password_hash
 *         - role
 *         - status_code
 *       properties:
 *         _id:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *           description: El ID auto-generado del usuario.
 *         first_name:
 *           type: string
 *           pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'
 *           description: El primer nombre del usuario.
 *         second_name:
 *           type: string
 *           pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'
 *           description: El segundo nombre del usuario (opcional).
 *         first_surname:
 *           type: string
 *           pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'
 *           description: El primer apellido del usuario.
 *         second_surname:
 *           type: string
 *           pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'
 *           description: El segundo apellido del usuario.
 *         email:
 *           type: string
 *           pattern: '^(?!.*\.\.)([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9._+-]*[a-zA-Z0-9])@([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9])\.[a-zA-Z]{2,}$'
 *           description: La dirección de correo electrónico del usuario.
 *         username:
 *           type: string
 *           pattern: '^[a-zA-Z0-9_]+$'
 *           description: El nombre de usuario único.
 *         password_hash:
 *           type: string
 *           description: La contraseña hasheada del usuario.
 *         password_updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de la última actualización de contraseña.
 *         role:
 *           type: string
 *           enum:
 *             - admin
 *             - user
 *             - moderator
 *           description: El rol del usuario en el sistema.
 *         avatar_url:
 *           type: string
 *           format: uri
 *           description: URL del avatar del usuario.
 *         status_code:
 *           type: integer
 *           description: Código de estado del usuario.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del usuario.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del usuario.
 *       additionalProperties: false
 *       example:
 *         _id: "68d02fce69061087d1a0da9d"
 *         first_name: "Valeria"
 *         second_name: "Andrea"
 *         first_surname: "Duarte"
 *         second_surname: "López"
 *         email: "valeria.duarte@karenflix.com"
 *         username: "valery_adl81"
 *         password_hash: "$2b$12$dNpOPYTANS3AED7ylk5vXetWw439RAeXWV.ST58F.mHGDAoTyX74u"
 *         password_updated_at: "2025-09-25T15:49:54.935Z"
 *         role: "admin"
 *         avatar_url: "https://i.postimg.cc/XNHhZdnf/admin-purple.png"
 *         status_code: 3929
 *         created_at: "2025-09-21T17:03:10.698Z"
 *         updated_at: "2025-09-21T17:03:10.698Z"
 *     PublicUser:
 *       type: object
 *       required:
 *         - _id
 *         - first_name
 *         - first_surname
 *         - email
 *         - username
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *           description: El ID auto-generado del usuario.
 *         first_name:
 *           type: string
 *           pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'
 *           description: El primer nombre del usuario.
 *         second_name:
 *           type: string
 *           pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'
 *           description: El segundo nombre del usuario (opcional).
 *         first_surname:
 *           type: string
 *           pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'
 *           description: El primer apellido del usuario.
 *         second_surname:
 *           type: string
 *           pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'
 *           description: El segundo apellido del usuario.
 *         email:
 *           type: string
 *           pattern: '^(?!.*\.\.)([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9._+-]*[a-zA-Z0-9])@([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9])\.[a-zA-Z]{2,}$'
 *           description: La dirección de correo electrónico del usuario.
 *         username:
 *           type: string
 *           pattern: '^[a-zA-Z0-9_]+$'
 *           description: El nombre de usuario único.
 *         role:
 *           type: string
 *           enum:
 *             - admin
 *             - user
 *             - moderator
 *           description: El rol del usuario en el sistema.
 *         avatar_url:
 *           type: string
 *           format: uri
 *           description: URL del avatar del usuario.
 *         status_code:
 *           type: integer
 *           description: Código de estado del usuario.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del usuario.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del usuario.
 *       additionalProperties: false
 *       example:
 *         _id: "68d02fce69061087d1a0da9d"
 *         first_name: "Valeria"
 *         second_name: "Andrea"
 *         first_surname: "Duarte"
 *         second_surname: "López"
 *         email: "valeria.duarte@karenflix.com"
 *         username: "valery_adl81"
 *         role: "admin"
 *         avatar_url: "https://i.postimg.cc/XNHhZdnf/admin-purple.png"
 *         status_code: 3929
 *         created_at: "2025-09-21T17:03:10.698Z"
 *         updated_at: "2025-09-21T17:03:10.698Z"
 *     UserRegistration:
 *       type: object
 *       required:
 *         - first_name
 *         - first_surname
 *         - email
 *         - username
 *         - password
 *       properties:
 *         first_name:
 *           type: string
 *           pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'
 *           description: El primer nombre del usuario.
 *         second_name:
 *           type: string
 *           pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'
 *           description: El segundo nombre del usuario (opcional).
 *         first_surname:
 *           type: string
 *           pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'
 *           description: El primer apellido del usuario.
 *         second_surname:
 *           type: string
 *           pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'
 *           description: El segundo apellido del usuario.
 *         email:
 *           type: string
 *           pattern: '^(?!.*\.\.)([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9._+-]*[a-zA-Z0-9])@([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9])\.[a-zA-Z]{2,}$'
 *           description: La dirección de correo electrónico del usuario.
 *         username:
 *           type: string
 *           pattern: '^[a-zA-Z0-9_]+$'
 *           description: El nombre de usuario único.
 *         password:
 *           type: string
 *           pattern: '^\S{8,}$'
 *           description: La contraseña del usuario (debe tener una longitud mínima de 8 caracteres).
 *         role:
 *           type: string
 *           enum:
 *             - admin
 *             - user
 *             - moderator
 *           description: El rol del usuario en el sistema.
 *         avatar_url:
 *           type: string
 *           format: uri
 *           description: URL del avatar del usuario.
 *       additionalProperties: false
 *       example:
 *         first_name: "Juan"
 *         second_name: "Carlos"
 *         first_surname: "Pérez"
 *         second_surname: "García"
 *         email: "juan.perez@ejemplo.com"
 *         username: "juan_perez123"
 *         password: "contraseñaSegura123"
 *         role: "user"
 *         avatar_url: "https://ejemplo.com/avatar.jpg"
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           pattern: '^(?!.*\.\.)([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9._+-]*[a-zA-Z0-9])@([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9])\.[a-zA-Z]{2,}$'
 *           description: La dirección de correo electrónico del usuario.
 *         password:
 *           type: string
 *           pattern: '^\S{8,}$'
 *           description: La contraseña del usuario (debe tener una longitud mínima de 8 caracteres).
 *       additionalProperties: false
 *       example:
 *         email: "juan.perez@ejemplo.com"
 *         password: "contraseñaSegura123"
 *     Error:
 *       type: object
 *       required:
 *         - error
 *       properties:
 *         error:
 *           type: string
 *           pattern: '^\S[\s\S]*\S$'
 *           description: Descripción del error.
 *       additionalProperties: false
 *     Message:
 *       type: string
 *       pattern: '^\S[\s\S]*\S$'
 *       description: Descripción de la respuesta de la solicitud.
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestionamiento de usuarios.
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registra nuevos usuarios en la base de datos.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *         headers:
 *           Location:
 *             description: URL del usuario registrado.
 *             schema:
 *               type: string
 *               format: uri-reference
 *             example: /users/68d02fce69061087d1a0da9d
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - msg
 *                 - response
 *                 - data
 *               properties:
 *                 msg:
 *                   $ref: '#/components/schemas/Message'
 *                 response:
 *                   type: object
 *                   required:
 *                     - acknowledged
 *                     - insertedId
 *                   properties:
 *                     acknowledged:
 *                       type: boolean
 *                     insertedId:
 *                       type: string
 *                       pattern: '^[a-fA-F0-9]{24}$'
 *                       example: "68d02fce69061087d1a0da9d"
 *                 data:
 *                   $ref: '#/components/schemas/PublicUser'
 *       400:
 *         description: Error por solicitud inválida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Error por conflicto - usuario ya existe.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
users.post('/register', (req, res) => ctrl.register(req, res));

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Inicia sesión con las credenciales de usuarios registrados en la base de datos (retorna un token de acceso que permite la ejecución de acciones que necesiten autenticación).
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       202:
 *         description: El token de acceso que permitirá la ejecución de determinadas acciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - msg
 *                 - token
 *                 - expiresIn
 *               properties:
 *                 msg:
 *                   $ref: '#/components/schemas/Message'
 *                 token:
 *                   type: string
 *                   pattern: '^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$'
 *                   readOnly: true
 *                   description: JWT token de acceso.
 *                 expiresIn:
 *                   type: string
 *                   pattern: '^(0|[1-9][0-9]{0,9})(ms|[dhmswy])$'
 *                   description: Tiempo de expiración del token.
 *       401:
 *         description: Error por fallo en la verificación de credenciales.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Error por usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
users.post('/login', (req, res) => ctrl.signIn(req, res));

module.exports = { users };