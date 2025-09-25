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
            res.status(response.status).location(`/users/${response.data.insertedId}`).json({ ok: true, message: 'success (user registered in the database)', insertedDocument: response.data });
        } catch (err) {
            res.status(err.status ?? 500).json({ ok: false, error: err.message });
        };
    };

    async signIn(req, res) {

    };

    async editProfile(req, res) {

    };

    async logOut(req, res) {

    };
};

module.exports = { UserController };