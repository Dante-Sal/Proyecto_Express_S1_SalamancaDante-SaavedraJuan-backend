require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const cookieParser = require('cookie-parser');
const swaggerUI = require('swagger-ui-express');
const { specs } = require('./swagger/swagger');
const { Authorization } = require('./middlewares/authorizationMiddlewares');
const { UserUtils } = require('./utils/userUtils');

const app = express();
const auth = new Authorization();

let PORT = process.env.PORT?.trim() ?? 'undefined';
if (!/^[0-9]+$/.test(PORT) || PORT < 3000 || PORT > 3999) PORT = Math.floor(Math.random() * (3999 - 3000 + 1)) + 3000;

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
app.use(passport.initialize());
passport.use(auth.setStrategy());

app.use((req, res, next) => {
    try {
        if (!process.env.COOKIE_SECRET) UserUtils.throwError(400, 'Invalid request (undefined environment variable \'COOKIE_SECRET\')');
        next();
    } catch (err) { res.status(err.status ?? 500).json({ ok: false, error: err.message }); };
});

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use('/', require('./routes'));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use((req, res) => res.status(404).json({ ok: false, error: `Not found (route ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} does not exist)` }));

app.listen(parseInt(PORT), async () => {
    console.log('Bienvenido a KarenFlix!');
    await UserUtils.hashAll();
});