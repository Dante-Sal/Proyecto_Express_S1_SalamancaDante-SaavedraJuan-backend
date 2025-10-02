const { ReviewRepository } = require('../repositories/reviewRepository');

class ReviewController {
    constructor() {
        this.repository = new ReviewRepository();
        this.generateFile = this.generateFile.bind(this);
    };

    async generateFile(req, res) {
        try {
            const id = req.params.id;
            const documents = await this.repository.listById(id);
            res.status(200).json({ ok: true, message: 'Success (reviews extracted from the database)', documents });
        } catch (err) { res.status(500).json({ ok: false, error: err.message }); };
    };
};

module.exports = { ReviewController };