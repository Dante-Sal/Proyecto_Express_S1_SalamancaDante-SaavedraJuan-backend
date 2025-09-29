const { Router } = require('express');
const { RateLimiting } = require('../config/rateLimiting');
const { GenreController } = require('../controllers/genreController');

const genres = Router();
const ctrl = new GenreController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Genre:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del género
 *           example: "68d02fce69061087d1a0da9d"
 *         code:
 *           type: string
 *           description: Código único del género
 *           example: "ACT"
 *         name:
 *           type: string
 *           description: Nombre del género
 *           example: "Action"
 *         description:
 *           type: string
 *           description: Descripción del género
 *           example: "Películas y series de acción con escenas intensas"
 *         slug:
 *           type: string
 *           description: Slug del género para URLs
 *           example: "action"
 *         is_active:
 *           type: boolean
 *           description: Indica si el género está activo
 *           example: true
 *         order:
 *           type: integer
 *           description: Orden de visualización del género
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-09-21T17:03:10.698Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-09-21T17:03:10.698Z"
 *
 *     GenreListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           description: Código de estado HTTP
 *           example: 200
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Genre'
 *         total:
 *           type: integer
 *           description: Total de géneros en el sistema
 *           example: 15
 *
 *     GenreError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje descriptivo del error
 *         status:
 *           type: integer
 *           description: Código de estado HTTP del error
 */

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Listar todos los géneros
 *     description: |
 *       Obtiene la lista completa de géneros disponibles en el sistema.
 *       
 *       **Funcionalidades:**
 *       - Lista todos los géneros activos del sistema
 *       - Ordenados según el campo 'order' configurado
 *       - Incluye información completa de cada género
 *       - Opcionalmente puede filtrar solo géneros activos
 *       
 *       **Casos de uso:**
 *       - Mostrar categorías en el catálogo
 *       - Filtros de búsqueda por género
 *       - Navegación por categorías
 *       - Menús de selección
 *       
 *       **Ordenamiento:**
 *       Los géneros se retornan ordenados por el campo 'order' de forma ascendente,
 *       permitiendo un control preciso de cómo se muestran al usuario
 *       
 *       **Rate Limiting:** Este endpoint tiene límite de solicitudes por IP/usuario
 *       
 *       **Cache recomendado:** Este endpoint es ideal para cacheo del lado del cliente
 *       ya que los géneros cambian con poca frecuencia
 *     tags: [Genres]
 *     parameters:
 *       - in: query
 *         name: active_only
 *         schema:
 *           type: boolean
 *         description: Filtrar solo géneros activos
 *         example: true
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [order, name, created_at]
 *         description: Campo por el cual ordenar los géneros
 *         example: "order"
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Dirección del ordenamiento
 *         example: "asc"
 *     responses:
 *       200:
 *         description: Lista de géneros obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenreListResponse'
 *             examples:
 *               all_genres:
 *                 summary: Todos los géneros del sistema
 *                 value:
 *                   status: 200
 *                   data:
 *                     - _id: "68d02fce69061087d1a0da9d"
 *                       code: "ACT"
 *                       name: "Action"
 *                       description: "Películas y series de acción con escenas intensas"
 *                       slug: "action"
 *                       is_active: true
 *                       order: 1
 *                       created_at: "2025-09-21T17:03:10.698Z"
 *                       updated_at: "2025-09-21T17:03:10.698Z"
 *                     - _id: "68d02fce69061087d1a0da9e"
 *                       code: "COM"
 *                       name: "Comedy"
 *                       description: "Contenido humorístico y ligero"
 *                       slug: "comedy"
 *                       is_active: true
 *                       order: 2
 *                       created_at: "2025-09-21T17:05:20.123Z"
 *                       updated_at: "2025-09-21T17:05:20.123Z"
 *                     - _id: "68d02fce69061087d1a0da9f"
 *                       code: "DRA"
 *                       name: "Drama"
 *                       description: "Historias profundas y emocionales"
 *                       slug: "drama"
 *                       is_active: true
 *                       order: 3
 *                       created_at: "2025-09-21T17:06:45.456Z"
 *                       updated_at: "2025-09-21T17:06:45.456Z"
 *                     - _id: "68d02fce69061087d1a0daa0"
 *                       code: "HOR"
 *                       name: "Horror"
 *                       description: "Contenido de terror y suspenso"
 *                       slug: "horror"
 *                       is_active: true
 *                       order: 4
 *                       created_at: "2025-09-21T17:08:10.789Z"
 *                       updated_at: "2025-09-21T17:08:10.789Z"
 *                     - _id: "68d02fce69061087d1a0daa1"
 *                       code: "SCI"
 *                       name: "Sci-Fi"
 *                       description: "Ciencia ficción y futurismo"
 *                       slug: "sci-fi"
 *                       is_active: true
 *                       order: 5
 *                       created_at: "2025-09-21T17:09:30.012Z"
 *                       updated_at: "2025-09-21T17:09:30.012Z"
 *                   total: 15
 *               active_only:
 *                 summary: Solo géneros activos
 *                 value:
 *                   status: 200
 *                   data:
 *                     - _id: "68d02fce69061087d1a0da9d"
 *                       code: "ACT"
 *                       name: "Action"
 *                       description: "Películas y series de acción con escenas intensas"
 *                       slug: "action"
 *                       is_active: true
 *                       order: 1
 *                       created_at: "2025-09-21T17:03:10.698Z"
 *                       updated_at: "2025-09-21T17:03:10.698Z"
 *                     - _id: "68d02fce69061087d1a0da9e"
 *                       code: "COM"
 *                       name: "Comedy"
 *                       description: "Contenido humorístico y ligero"
 *                       slug: "comedy"
 *                       is_active: true
 *                       order: 2
 *                       created_at: "2025-09-21T17:05:20.123Z"
 *                       updated_at: "2025-09-21T17:05:20.123Z"
 *                   total: 12
 *               empty_list:
 *                 summary: Sistema sin géneros configurados
 *                 value:
 *                   status: 200
 *                   data: []
 *                   total: 0
 *       400:
 *         description: Error de validación en los parámetros de consulta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenreError'
 *             examples:
 *               invalid_sort:
 *                 summary: Campo de ordenamiento inválido
 *                 value:
 *                   error: "Invalid request (invalid sort field)"
 *                   status: 400
 *               invalid_order:
 *                 summary: Dirección de orden inválida
 *                 value:
 *                   error: "Invalid request (order must be 'asc' or 'desc')"
 *                   status: 400
 *               invalid_boolean:
 *                 summary: Valor booleano inválido
 *                 value:
 *                   error: "Invalid request (active_only must be a boolean)"
 *                   status: 400
 *       429:
 *         description: Demasiadas solicitudes - Rate limit excedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenreError'
 *             example:
 *               error: "Too many requests (rate limit exceeded)"
 *               status: 429
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenreError'
 *             examples:
 *               db_error:
 *                 summary: Error de base de datos
 *                 value:
 *                   error: "Database error (unable to fetch genres)"
 *                   status: 500
 *               server_error:
 *                 summary: Error interno general
 *                 value:
 *                   error: "Internal server error"
 *                   status: 500
 */
genres.get('/', RateLimiting.genreListLimiter, ctrl.list);

module.exports = { genres };