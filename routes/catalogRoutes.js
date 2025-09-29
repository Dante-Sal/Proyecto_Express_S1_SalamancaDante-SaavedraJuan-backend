const { Router } = require('express');
const { RateLimiting } = require('../config/rateLimiting');
const { CatalogController } = require('../controllers/catalogController');

const catalog = Router();
const ctrl = new CatalogController();

/**
 * @swagger
 * components:
 *   schemas:
 *     CatalogItem:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: Código único del item del catálogo
 *           example: "CAT001"
 *         name:
 *           type: string
 *           description: Nombre del item
 *           example: "Producto Premium"
 *         description:
 *           type: string
 *           description: Descripción detallada del item
 *           example: "Descripción completa del producto"
 *         category:
 *           type: string
 *           description: Categoría del item
 *           example: "Electronics"
 *         price:
 *           type: number
 *           format: float
 *           description: Precio del item
 *           example: 299.99
 *         stock:
 *           type: integer
 *           description: Cantidad disponible en stock
 *           example: 50
 *         image_url:
 *           type: string
 *           format: uri
 *           description: URL de la imagen del item
 *           example: "https://example.com/images/product.jpg"
 *         status:
 *           type: string
 *           enum: [active, inactive, discontinued]
 *           description: Estado del item en el catálogo
 *           example: "active"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-09-21T17:03:10.698Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-09-21T17:03:10.698Z"
 *
 *     CatalogFilterResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           description: Código de estado HTTP
 *           example: 200
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CatalogItem'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: Total de items encontrados
 *               example: 150
 *             page:
 *               type: integer
 *               description: Página actual
 *               example: 1
 *             limit:
 *               type: integer
 *               description: Items por página
 *               example: 20
 *             pages:
 *               type: integer
 *               description: Total de páginas
 *               example: 8
 *
 *     CatalogItemResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           description: Código de estado HTTP
 *           example: 200
 *         data:
 *           $ref: '#/components/schemas/CatalogItem'
 *
 *     CatalogError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje descriptivo del error
 *         status:
 *           type: integer
 *           description: Código de estado HTTP del error
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Token JWT obtenido del endpoint de login
 */

/**
 * @swagger
 * /catalog:
 *   get:
 *     summary: Filtrar y listar items del catálogo
 *     description: |
 *       Obtiene una lista filtrada de items del catálogo con soporte para paginación y múltiples criterios de búsqueda.
 *       
 *       **Funcionalidades de filtrado:**
 *       - Búsqueda por nombre (búsqueda parcial, case-insensitive)
 *       - Filtro por categoría
 *       - Filtro por rango de precios (min/max)
 *       - Filtro por estado (active, inactive, discontinued)
 *       - Ordenamiento por diferentes campos
 *       - Paginación configurable
 *       
 *       **Parámetros de paginación:**
 *       - page: Número de página (por defecto: 1)
 *       - limit: Items por página (por defecto: 20, máximo: 100)
 *       
 *       **Ordenamiento:**
 *       - sortBy: Campo por el cual ordenar (name, price, created_at, etc.)
 *       - order: Dirección del ordenamiento (asc, desc)
 *       
 *       **Rate Limiting:** Este endpoint tiene límite de solicitudes por IP/usuario
 *     tags: [Catalog]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda para filtrar por nombre
 *         example: "Premium"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría específica
 *         example: "Electronics"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Precio mínimo para filtrar
 *         example: 100.00
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Precio máximo para filtrar
 *         example: 500.00
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, discontinued]
 *         description: Filtrar por estado del item
 *         example: "active"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de página
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Cantidad de items por página
 *         example: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, created_at, updated_at]
 *         description: Campo por el cual ordenar los resultados
 *         example: "price"
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Dirección del ordenamiento
 *         example: "asc"
 *     responses:
 *       200:
 *         description: Lista de items del catálogo obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CatalogFilterResponse'
 *             examples:
 *               with_filters:
 *                 summary: Búsqueda con filtros aplicados
 *                 value:
 *                   status: 200
 *                   data:
 *                     - code: "CAT001"
 *                       name: "Laptop Premium"
 *                       description: "Laptop de alta gama"
 *                       category: "Electronics"
 *                       price: 1299.99
 *                       stock: 25
 *                       image_url: "https://example.com/laptop.jpg"
 *                       status: "active"
 *                       created_at: "2025-09-21T17:03:10.698Z"
 *                       updated_at: "2025-09-21T17:03:10.698Z"
 *                     - code: "CAT002"
 *                       name: "Smartphone Premium"
 *                       description: "Teléfono de última generación"
 *                       category: "Electronics"
 *                       price: 899.99
 *                       stock: 50
 *                       image_url: "https://example.com/phone.jpg"
 *                       status: "active"
 *                       created_at: "2025-09-22T10:15:30.123Z"
 *                       updated_at: "2025-09-22T10:15:30.123Z"
 *                   pagination:
 *                     total: 150
 *                     page: 1
 *                     limit: 20
 *                     pages: 8
 *               all_items:
 *                 summary: Todos los items sin filtros
 *                 value:
 *                   status: 200
 *                   data: []
 *                   pagination:
 *                     total: 0
 *                     page: 1
 *                     limit: 20
 *                     pages: 0
 *       400:
 *         description: Error de validación en los parámetros de consulta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CatalogError'
 *             examples:
 *               invalid_page:
 *                 summary: Número de página inválido
 *                 value:
 *                   error: "Invalid request (page must be a positive integer)"
 *                   status: 400
 *               invalid_limit:
 *                 summary: Límite fuera de rango
 *                 value:
 *                   error: "Invalid request (limit must be between 1 and 100)"
 *                   status: 400
 *               invalid_price_range:
 *                 summary: Rango de precios inválido
 *                 value:
 *                   error: "Invalid request (minPrice cannot be greater than maxPrice)"
 *                   status: 400
 *               invalid_sort_field:
 *                 summary: Campo de ordenamiento inválido
 *                 value:
 *                   error: "Invalid request (invalid sortBy field)"
 *                   status: 400
 *       429:
 *         description: Demasiadas solicitudes - Rate limit excedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CatalogError'
 *             example:
 *               error: "Too many requests (rate limit exceeded)"
 *               status: 429
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CatalogError'
 *             examples:
 *               db_error:
 *                 summary: Error de base de datos
 *                 value:
 *                   error: "Database error (unable to fetch catalog items)"
 *                   status: 500
 *               server_error:
 *                 summary: Error interno general
 *                 value:
 *                   error: "Internal server error"
 *                   status: 500
 */
catalog.get('/', RateLimiting.catalogFilterLimiter, ctrl.filter);

/**
 * @swagger
 * /catalog/{code}:
 *   get:
 *     summary: Obtener item del catálogo por código
 *     description: |
 *       Obtiene la información completa de un item específico del catálogo usando su código único.
 *       
 *       **Proceso de búsqueda:**
 *       1. Valida que el código tenga un formato válido
 *       2. Busca el item en la base de datos por su código único
 *       3. Verifica que el item exista y esté disponible
 *       4. Retorna toda la información detallada del item
 *       
 *       **Información incluida:**
 *       - Datos básicos del producto (nombre, descripción)
 *       - Información de precio y stock
 *       - Categoría y estado
 *       - URLs de imágenes
 *       - Metadatos (timestamps)
 *       
 *       **Rate Limiting:** Este endpoint tiene límite de solicitudes por IP/usuario
 *       
 *       **Nota:** El código debe ser exacto y válido
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código único del item del catálogo
 *         example: "CAT001"
 *     responses:
 *       200:
 *         description: Item del catálogo encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CatalogItemResponse'
 *             examples:
 *               electronics_item:
 *                 summary: Item de electrónica
 *                 value:
 *                   status: 200
 *                   data:
 *                     code: "CAT001"
 *                     name: "Laptop Premium"
 *                     description: "Laptop de alta gama con procesador Intel Core i7, 16GB RAM, 512GB SSD"
 *                     category: "Electronics"
 *                     price: 1299.99
 *                     stock: 25
 *                     image_url: "https://example.com/images/laptop.jpg"
 *                     status: "active"
 *                     created_at: "2025-09-21T17:03:10.698Z"
 *                     updated_at: "2025-09-21T17:03:10.698Z"
 *               clothing_item:
 *                 summary: Item de ropa
 *                 value:
 *                   status: 200
 *                   data:
 *                     code: "CAT050"
 *                     name: "Camiseta Deportiva"
 *                     description: "Camiseta de algodón premium para entrenamiento"
 *                     category: "Clothing"
 *                     price: 29.99
 *                     stock: 100
 *                     image_url: "https://example.com/images/shirt.jpg"
 *                     status: "active"
 *                     created_at: "2025-09-15T08:20:45.123Z"
 *                     updated_at: "2025-09-15T08:20:45.123Z"
 *       400:
 *         description: Código inválido o formato incorrecto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CatalogError'
 *             examples:
 *               invalid_code_format:
 *                 summary: Formato de código inválido
 *                 value:
 *                   error: "Invalid request (invalid code format)"
 *                   status: 400
 *               missing_code:
 *                 summary: Código no proporcionado
 *                 value:
 *                   error: "Invalid request (code is required)"
 *                   status: 400
 *       404:
 *         description: Item no encontrado en el catálogo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CatalogError'
 *             examples:
 *               not_found:
 *                 summary: Item no existe
 *                 value:
 *                   error: "Not found (catalog item with code 'CAT999' does not exist)"
 *                   status: 404
 *               discontinued:
 *                 summary: Item descontinuado
 *                 value:
 *                   error: "Not found (catalog item has been discontinued)"
 *                   status: 404
 *       429:
 *         description: Demasiadas solicitudes - Rate limit excedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CatalogError'
 *             example:
 *               error: "Too many requests (rate limit exceeded)"
 *               status: 429
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CatalogError'
 *             examples:
 *               db_error:
 *                 summary: Error de base de datos
 *                 value:
 *                   error: "Database error (unable to retrieve catalog item)"
 *                   status: 500
 *               server_error:
 *                 summary: Error interno general
 *                 value:
 *                   error: "Internal server error"
 *                   status: 500
 */
catalog.get('/:code', RateLimiting.catalogfindByCodeLimiter, ctrl.findByCode);

module.exports = { catalog };