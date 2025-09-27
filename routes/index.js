const { Router } = require('express');
const { users } = require('./userRoutes');
const { catalog } = require('./catalogRoutes');
const { genres } = require('./genreRoutes');

const _router = Router();

_router.use('/users', users);
_router.use('/catalog', catalog);
_router.use('/genres', genres);

module.exports = _router;