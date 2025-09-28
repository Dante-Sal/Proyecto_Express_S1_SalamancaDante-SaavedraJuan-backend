require('dotenv').config();
const { GenreRepository } = require('../repositories/genreRepository');

class GenreController {
    constructor() {
        this.repository = new GenreRepository();
        this.list = this.list.bind(this);
    };

    async list(req, res) {
        try {
            const documents = await this.repository.list();
            res.status(200).json({ ok: true, message: 'Success (genres extracted from the database)', documents });
        } catch (err) { res.status(500).json({ ok: false, error: err.message }); };
    };
};

module.exports = { GenreController };