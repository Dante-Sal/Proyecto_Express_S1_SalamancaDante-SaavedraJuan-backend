const { Router } = require('express');
const { users } = require('./userRoutes');

const _users = Router();

_users.use('/users', users);

module.exports = _users;