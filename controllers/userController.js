require('dotenv').config();
const ms = require('ms');
const { UserRepository } = require('../repositories/userRepository');
const { UserService } = require('../services/userService');
const { UserUtils } = require('../utils/userUtils');

class UserController {
    constructor() {
        this.repository = new UserRepository();
        this.service = new UserService();
        this.register = this.register.bind(this);
        this.signIn = this.signIn.bind(this);
        this.me = this.me.bind(this);
        this.editProfile = this.editProfile.bind(this);
        this.logOut = this.logOut.bind(this);
    };

    async register(req, res) {
        try {
            const response = await this.service.register(req.body);
            res.status(response.status).location(`/users/${response.data._id}`).json({ ok: true, message: 'Success (user registered in the database)', insertedDocument: response.data, redirect: '/index.html' });
        } catch (err) { res.status(err.status ?? 500).json({ ok: false, error: err.message }); };
    };

    async signIn(req, res) {
        try {
            const response = await this.service.signIn(req.body);

            let expires = process.env.JWT_AND_COOKIE_EXPIRES?.trim() ?? 'undefined';

            if (UserUtils.isTimeString(expires)) {
                if (/^(?!^0(\.0+)?$)(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(expires.trim())) expires = new Date(Date.now() + parseFloat(expires) * 1000);
                else expires = new Date(Date.now() + (ms(expires.trim()) ?? 30 * 60 * 1000));
            } else { expires = new Date(Date.now() + 30 * 60 * 1000) };

            const options = {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                signed: true,
                path: '/',
                expires
            };

            res.cookie('login', response.token, options);
            res.status(response.status).json({ ok: true, message: 'Success (access allowed)' });
        } catch (err) { res.status(err.status ?? 500).json({ ok: false, error: err.message }); };
    };

    async me(req, res) {
        try {
            const document = await this.repository.findPublicById(req.user._id);
            res.status(200).json({ ok: true, message: 'Success (user data extracted from the database)', document, redirect: { user: '/html/main.html', admin: '/html/main_admin.html' } });
        } catch (err) { res.status(err.status ?? 500).json({ ok: false, error: err.message }); };
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