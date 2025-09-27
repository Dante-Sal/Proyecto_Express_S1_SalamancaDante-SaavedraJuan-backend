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

            let expires = process.env.COOKIE_EXPIRES?.trim() ?? 'undefined';
            if (!/^(0|[1-9][0-9]*)(\.[0-9]*)?$/.test(expires) || expires < 0) expires = 0.1;
            expires = new Date(Date.now() + parseFloat(expires) * 24 * 60 * 60 * 1000);

            const options = {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
                expires
            };

            res.cookie('login', response.token, options);
            res.status(response.status).json({ ok: true, message: 'Success (access allowed)', role, redirect: { admin: '/html/main_admin.html', user: '/html/main.html' } });
        } catch (err) {
            res.status(err.status ?? 500).json({ ok: false, error: err.message });
        };
    };

    async editProfile(req, res) {

    };

    async logOut(req, res) {
        res.clearCookie('login', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });

        res.status(200).json({ ok: true, message: 'Success (logged out)', redirect: '/index.html' });
    };
};

module.exports = { UserController };