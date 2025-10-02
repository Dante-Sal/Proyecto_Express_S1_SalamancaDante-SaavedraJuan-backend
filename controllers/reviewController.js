const { ReviewRepository } = require('../repositories/reviewRepository');
const fs = require('fs');

class ReviewController {
    constructor() {
        this.repository = new ReviewRepository();
        this.generateFile = this.generateFile.bind(this);
    };

    load(id) {
        if (!fs.existsSync(`../Proyecto_Express_S1_SalamancaDante-SaavedraJuan-backend/exports/review_${id}.csv`)) {
            fs.writeFileSync(`../Proyecto_Express_S1_SalamancaDante-SaavedraJuan-backend/exports/review_${id}.csv`, `[]`);
        };
        const data = fs.readFileSync(`../Proyecto_Express_S1_SalamancaDante-SaavedraJuan-backend/exports/review_${id}.csv`);
        return JSON.parse(data);
    };

    save(id, data) {
        fs.writeFileSync(`../Proyecto_Express_S1_SalamancaDante-SaavedraJuan-backend/exports/review_${id}.csv`, JSON.stringify(data));
    };

    async generateFile(req, res) {
        try {
            const id = req.params.id;
            const documents = await this.repository.listById(id);
            const fileData = this.load(id);
            fileData.push(documents);
            this.save(id, fileData);
            res.status(200).json({ ok: true, message: 'Success (reviews extracted from the database; file created at \'/exports\')', documents });
        } catch (err) { res.status(500).json({ ok: false, error: err.message }); };
    };
};

module.exports = { ReviewController };