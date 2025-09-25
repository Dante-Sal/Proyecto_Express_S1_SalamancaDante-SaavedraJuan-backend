require('dotenv').config();
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

let PORT = parseInt(process.env.PORT?.trim());
if (!Number.isFinite(PORT) || PORT < 3000 || PORT > 3999) PORT = 3103;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API KarenFlix Movie Website',
            version: '1.0.0',
            description: '',
            contact: {
                name: 'Simón Dante Salamanca Galvis'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Localhost'
            },
            {
                url: 'https://proyecto-express-s1-salamancadante.onrender.com',
                description: 'Render deployment'
            }
        ]
    },
    apis: [path.join(__dirname, '../routes/*.js')]
};

const specs = swaggerJSDoc(options);

module.exports = { specs };