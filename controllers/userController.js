require('dotenv').config();
const { UserRepository } = require('../repositories/userRepository');
const { UserService } = require('../services/userService');
const { UserUtils } = require('../utils/userUtils');

class UserController {
    constructor() {
        this.service = new UserService();
    };

    async register(req, res) {
        try {
            const response = await this.service.register(req.body);
            res.status(response.status).location(`/users/${response.data._id}`).json({ ok: true, message: 'Success (user registered in the database)', insertedDocument: response.data, redirect: '/index.html' });
        } catch (err) {
            res.status(err.status ?? 500).json({ ok: false, error: err.message });
        };
    };

    async signIn(req, res) {
        try {
            const response = await this.service.signIn(req.body);

            let expiresInMs = parseFloat(process.env.COOKIE_EXPIRES.trim());
            if (!Number.isFinite(expiresInMs) || expiresInMs < 0) expiresInMs = 0.1;
            expiresInMs = new Date(Date.now() + expiresInMs * 24 * 60 * 60 * 1000);

            const options = {
                expires: expiresInMs,
                path: '/'
            };

            res.cookie('login', response.token, options);
            res.status(response.status).json({ ok: true, message: 'Success (access allowed)', redirect: { admin: '/html/main_admin.html', user: '/html/main.html' } });
        } catch (err) {
            res.status(err.status ?? 500).json({ ok: false, error: err.message });
        };
    };

    async editProfile(req, res) {

    };

    async logOut(req, res) {

    };
};

module.exports = { UserController };