const { Router } = require('express');
const { users } = require('./userRoutes');
const { catalog } = require('./catalogRoutes');
const { genres } = require('./genreRoutes');
const { reviews } = require('./reviewRoutes');

const _router = Router();

_router.use('/users', users);
_router.use('/catalog', catalog);
_router.use('/genres', genres);
_router.use('/reviews', reviews);

module.exports = _router;