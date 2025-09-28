require('dotenv').config();
const { CatalogService } = require('../services/catalogService');

class CatalogController {
    constructor() {
        this.service = new CatalogService();
        this.filter = this.filter.bind(this);
        this.findByCode = this.findByCode.bind(this);
    };

    async filter(req, res) {
        try {
            const documents = await this.service.filter(req.query);
            res.status(200).json({ ok: true, message: 'Success (catalog extracted from the database)', documents });
        } catch (err) { res.status(err.status ?? 500).json({ ok: false, error: err.message }); };
    };

    async findByCode(req, res) {
        try {
            const document = await this.service.findByCode(req.params);
            res.status(200).json({ ok: true, message: 'Success (title extracted from the catalog)', document });
        } catch (err) { res.status(err.status ?? 500).json({ ok: false, error: err.message }); };
    };
};

module.exports = { CatalogController };