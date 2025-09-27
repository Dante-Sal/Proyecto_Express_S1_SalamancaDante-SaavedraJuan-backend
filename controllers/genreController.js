require('dotenv').config();
const { GenreRepository } = require('../repositories/genreRepository');

class GenreController {
    constructor() {
        this.repository = new GenreRepository();
    };

    async list(req, res) {
        try {
            const genres = await this.repository.list();
            res.status(200).json({ ok: true, message: 'Success (genres extracted from the database)', documents: genres });
        } catch (err) {
            res.status(500).json({ ok: false, error: err.message });
        };
    };
};

module.exports = { GenreController };