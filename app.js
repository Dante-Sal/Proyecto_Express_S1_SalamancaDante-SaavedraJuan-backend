require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const { UserUtils } = require('./utils/userUtils');
const { specs } = require('./swagger/swagger');

const app = express();

let PORT = process.env.PORT?.trim() ?? 'undefined';
if (!/^[0-9]+$/.test(PORT) || PORT < 3000 || PORT > 3999) PORT = 3103;

const options = {
    origin: 'https://dante-sal.github.io',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204
};

app.set('trust proxy', 1);
app.use(cors(options));
app.use((req, res, next) => { if (req.method === 'OPTIONS') return res.sendStatus(204); next(); });
app.use(express.json());
app.use('/', require('./routes'));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use((req, res) => res.status(404).json({ ok: false, error: `Not found (route ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} does not exist)` }));

app.listen(parseInt(PORT), async () => {
    console.log('Bienvenido a KarenFlix!');
    await UserUtils.hashAll();
});