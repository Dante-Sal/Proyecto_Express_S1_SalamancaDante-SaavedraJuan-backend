require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const { UserUtils } = require('./utils/userUtils');
const { specs } = require('./swagger/swagger');

const app = express();

let PORT = parseInt(process.env.PORT?.trim());
if (!Number.isFinite(PORT) || PORT < 3000 || PORT > 3999) PORT = 3103;

const allowed = ['https://dante-sal.github.io', 'http://127.0.0.1:5500', 'http://localhost:5500']

const options = {
    origin(origin, callback) {
        if (!origin || allowed.includes(origin)) return callback(null, true);
        return callback(new Error('CORS error (origin not allowed)'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204
};

app.use(cors(options));
app.options('/(.*)', cors(options));
app.use(express.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use('/', require('./routes'));

app.listen(PORT, async () => {
    console.log('Bienvenido a KarenFlix!');
    await UserUtils.hashAll();
});