const { Router } = require('express');
const { Authorization } = require('../middlewares/authorizationMiddlewares');
const { UserController } = require('../controllers/userController');

const users = Router();
const auth = new Authorization();
const ctrl = new UserController();

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - username
 *         - first_name
 *         - first_surname
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email único del usuario
 *           example: "valeria.duarte@karenflix.com"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           description: Contraseña del usuario (mínimo 8 caracteres)
 *           example: "MiPassword123!"
 *         username:
 *           type: string
 *           description: Nombre de usuario único
 *           example: "valery_adl81"
 *         first_name:
 *           type: string
 *           description: Primer nombre del usuario
 *           example: "Valeria"
 *         second_name:
 *           type: string
 *           description: Segundo nombre del usuario (opcional)
 *           example: "Andrea"
 *         first_surname:
 *           type: string
 *           description: Primer apellido del usuario
 *           example: "Duarte"
 *         second_surname:
 *           type: string
 *           description: Segundo apellido del usuario (opcional)
 *           example: "López"
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: Rol del usuario en el sistema
 *           example: "user"
 *         avatar_url:
 *           type: string
 *           format: uri
 *           description: URL del avatar del usuario (opcional)
 *           example: "https://i.postimg.cc/XNHhZdnf/admin-purple.png"
 *
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           description: Código de estado HTTP
 *           example: 201
 *         message:
 *           type: string
 *           description: Mensaje de confirmación
 *           example: "User registered successfully"
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: ID único del usuario creado
 *               example: "68d02fce69061087d1a0da9d"
 *             email:
 *               type: string
 *               example: "valeria.duarte@karenflix.com"
 *             username:
 *               type: string
 *               example: "valery_adl81"
 *             first_name:
 *               type: string
 *               example: "Valeria"
 *             role:
 *               type: string
 *               example: "user"
 *             status_code:
 *               type: integer
 *               example: 3929
 *             created_at:
 *               type: string
 *               format: date-time
 *               example: "2025-09-21T17:03:10.698Z"
 *
 *     RegisterError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje descriptivo del error
 *         status:
 *           type: integer
 *           description: Código de estado HTTP del error
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario registrado en el sistema
 *           example: "valeria.duarte@karenflix.com"
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *           example: "MiPassword123!"
 * 
 *     LoginResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           description: Código de estado HTTP
 *           example: 200
 *         token:
 *           type: string
 *           description: |
 *             Token JWT que contiene:
 *             - _id: ID del usuario (ObjectId)
 *             - role: Rol del usuario (user/admin)
 *             - iat: Timestamp de emisión
 *             - exp: Timestamp de expiración
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGQwMmZjZTY5MDYxMDg3ZDFhMGRhOWQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjY3NTAyMDAsImV4cCI6MTcyNjc1MzgwMH0.example_signature"
 * 
 *     LoginError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje descriptivo del error
 *           example: "Invalid request (incorrect 'email' or 'password')"
 *         status:
 *           type: integer
 *           description: Código de estado HTTP del error
 *           example: 401
 * 
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Token JWT obtenido del endpoint /users/login
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: |
 *       Crea un nuevo usuario en el sistema con validación completa de datos.
 *       
 *       **Proceso de registro:**
 *       1. Valida que todos los campos obligatorios estén presentes
 *       2. Verifica formato de email y que sea único en el sistema
 *       3. Verifica que el username sea único
 *       4. Valida requisitos mínimos de contraseña
 *       5. Hashea la contraseña usando bcrypt
 *       6. Asigna un status_code único al usuario
 *       7. Guarda el usuario en la base de datos
 *       
 *       **Campos obligatorios:**
 *       - email: Debe ser único y tener formato válido
 *       - password: Mínimo 8 caracteres
 *       - username: Debe ser único en el sistema
 *       - first_name: Primer nombre del usuario
 *       - first_surname: Primer apellido del usuario
 *       - role: Debe ser "user" o "admin"
 *       
 *       **Campos opcionales:**
 *       - second_name: Segundo nombre
 *       - second_surname: Segundo apellido
 *       - avatar_url: URL de imagen de avatar
 *       
 *       **El sistema automáticamente:**
 *       - Genera password_hash con bcrypt
 *       - Asigna status_code único
 *       - Establece created_at y updated_at
 *       - Establece password_updated_at
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             admin_user:
 *               summary: Registro de usuario admin
 *               value:
 *                 email: "admin@karenflix.com"
 *                 password: "AdminPass123!"
 *                 username: "admin_karen"
 *                 first_name: "Karen"
 *                 second_name: "María"
 *                 first_surname: "Rodríguez"
 *                 second_surname: "Silva"
 *                 role: "admin"
 *                 avatar_url: "https://i.postimg.cc/XNHhZdnf/admin-purple.png"
 *             regular_user:
 *               summary: Registro de usuario regular
 *               value:
 *                 email: "juan.perez@karenflix.com"
 *                 password: "UserPass456!"
 *                 username: "juanp_123"
 *                 first_name: "Juan"
 *                 first_surname: "Pérez"
 *                 role: "user"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *             examples:
 *               user_created:
 *                 summary: Usuario creado exitosamente
 *                 value:
 *                   status: 201
 *                   message: "User registered successfully"
 *                   user:
 *                     _id: "68d02fce69061087d1a0da9d"
 *                     email: "juan.perez@karenflix.com"
 *                     username: "juanp_123"
 *                     first_name: "Juan"
 *                     first_surname: "Pérez"
 *                     role: "user"
 *                     status_code: 3929
 *                     created_at: "2025-09-21T17:03:10.698Z"
 *       400:
 *         description: Error de validación en los datos enviados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterError'
 *             examples:
 *               no_body:
 *                 summary: Sin datos en el body
 *                 value:
 *                   error: "Invalid request (insufficient data in the body)"
 *                   status: 400
 *               missing_email:
 *                 summary: Email faltante
 *                 value:
 *                   error: "Invalid request (body without 'email' included)"
 *                   status: 400
 *               missing_password:
 *                 summary: Password faltante
 *                 value:
 *                   error: "Invalid request (body without 'password' included)"
 *                   status: 400
 *               missing_username:
 *                 summary: Username faltante
 *                 value:
 *                   error: "Invalid request (body without 'username' included)"
 *                   status: 400
 *               missing_first_name:
 *                 summary: Primer nombre faltante
 *                 value:
 *                   error: "Invalid request (body without 'first_name' included)"
 *                   status: 400
 *               missing_first_surname:
 *                 summary: Primer apellido faltante
 *                 value:
 *                   error: "Invalid request (body without 'first_surname' included)"
 *                   status: 400
 *               missing_role:
 *                 summary: Rol faltante
 *                 value:
 *                   error: "Invalid request (body without 'role' included)"
 *                   status: 400
 *               invalid_email_format:
 *                 summary: Formato de email inválido
 *                 value:
 *                   error: "Invalid request (invalid email format)"
 *                   status: 400
 *               invalid_role:
 *                 summary: Rol inválido
 *                 value:
 *                   error: "Invalid request (role must be 'user' or 'admin')"
 *                   status: 400
 *               password_too_short:
 *                 summary: Contraseña muy corta
 *                 value:
 *                   error: "Invalid request (password must be at least 8 characters long)"
 *                   status: 400
 *       409:
 *         description: Conflicto - Email o username ya existen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterError'
 *             examples:
 *               email_exists:
 *                 summary: Email ya registrado
 *                 value:
 *                   error: "Conflict (email already registered)"
 *                   status: 409
 *               username_exists:
 *                 summary: Username ya existe
 *                 value:
 *                   error: "Conflict (username already exists)"
 *                   status: 409
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterError'
 *             examples:
 *               db_error:
 *                 summary: Error de base de datos
 *                 value:
 *                   error: "Database error (unable to create user)"
 *                   status: 500
 *               hashing_error:
 *                 summary: Error al hashear contraseña
 *                 value:
 *                   error: "Internal server error (password hashing failed)"
 *                   status: 500
 *               server_error:
 *                 summary: Error interno general
 *                 value:
 *                   error: "Internal server error"
 *                   status: 500
 */
users.post('/register', auth.tryToVerifyToken, auth.public, ctrl.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: |
 *       Autentica un usuario existente y genera un token JWT para acceso a rutas protegidas.
 *       
 *       **Proceso de autenticación:**
 *       1. Valida formato de email y que la contraseña esté presente
 *       2. Normaliza el email a lowercase automáticamente
 *       3. Busca usuario activo con ese email (status_code debe ser válido)
 *       4. Verifica la contraseña usando bcrypt contra password_hash
 *       5. Genera token JWT con _id y role del usuario
 *       
 *       **Token JWT incluye:**
 *       - _id: ObjectId del usuario en la base de datos
 *       - role: Rol del usuario (user o admin)
 *       - iat: Timestamp de cuando se generó el token
 *       - exp: Timestamp de cuando expira el token
 *       
 *       **Variables de entorno requeridas:**
 *       - JWT_SECRET: Clave secreta para firmar el token
 *       - JWT_EXPIRES: Tiempo de expiración (por defecto: "1h")
 *       
 *       **Solo usuarios activos pueden hacer login** (verificación por status_code)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             admin_user:
 *               summary: Usuario admin
 *               value:
 *                 email: "valeria.duarte@karenflix.com"
 *                 password: "AdminPass123!"
 *             regular_user:
 *               summary: Usuario regular
 *               value:
 *                 email: "juan.perez@karenflix.com"
 *                 password: "UserPass456!"
 *     responses:
 *       200:
 *         description: Login exitoso - Token JWT generado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             examples:
 *               admin_login:
 *                 summary: Login exitoso de admin
 *                 value:
 *                   status: 200
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGQwMmZjZTY5MDYxMDg3ZDFhMGRhOWQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjY3NTAyMDAsImV4cCI6MTcyNjc1MzgwMH0.abc123"
 *               user_login:
 *                 summary: Login exitoso de usuario
 *                 value:
 *                   status: 200
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGQwMmZjZTY5MDYxMDg3ZDFhMGRhOWQiLCJyb2xlIjoidXNlciIsImlhdCI6MTcyNjc1MDIwMCwiZXhwIjoxNzI2NzUzODAwfQ.def456"
 *       400:
 *         description: Error de validación en los datos enviados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginError'
 *             examples:
 *               no_body:
 *                 summary: Sin datos en el body
 *                 value:
 *                   error: "Invalid request (insufficient data in the body)"
 *                   status: 400
 *               missing_email:
 *                 summary: Email faltante
 *                 value:
 *                   error: "Invalid request (body without 'email' included)"
 *                   status: 400
 *               missing_password:
 *                 summary: Password faltante
 *                 value:
 *                   error: "Invalid request (body without 'password' included)"
 *                   status: 400
 *               invalid_email_format:
 *                 summary: Formato de email inválido
 *                 value:
 *                   error: "Invalid request (invalid email format)"
 *                   status: 400
 *               jwt_secret_missing:
 *                 summary: JWT_SECRET no configurado
 *                 value:
 *                   error: "Invalid request (undefined environment variable 'secret')"
 *                   status: 400
 *       401:
 *         description: Credenciales incorrectas o usuario inactivo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginError'
 *             examples:
 *               wrong_credentials:
 *                 summary: Email o contraseña incorrectos
 *                 value:
 *                   error: "Invalid request (incorrect 'email' or 'password')"
 *                   status: 401
 *               user_inactive:
 *                 summary: Usuario inactivo (mismo mensaje por seguridad)
 *                 value:
 *                   error: "Invalid request (incorrect 'email' or 'password')"
 *                   status: 401
 *               user_not_found:
 *                 summary: Usuario no encontrado (mismo mensaje por seguridad)
 *                 value:
 *                   error: "Invalid request (incorrect 'email' or 'password')"
 *                   status: 401
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginError'
 *             examples:
 *               db_error:
 *                 summary: Error de base de datos
 *                 value:
 *                   error: "Database error (user status 'active' does not exist)"
 *                   status: 500
 *               bcrypt_error:
 *                 summary: Error al verificar contraseña
 *                 value:
 *                   error: "Internal server error (password verification failed)"
 *                   status: 500
 *               jwt_error:
 *                 summary: Error al generar token
 *                 value:
 *                   error: "Internal server error (token generation failed)"
 *                   status: 500
 *               server_error:
 *                 summary: Error interno general
 *                 value:
 *                   error: "Internal server error"
 *                   status: 500
 */
users.post('/login', auth.tryToVerifyToken, auth.public, ctrl.signIn);

users.get('/me', auth.verifyToken, ctrl.me);

users.get('/logout', ctrl.logOut);

module.exports = { users };