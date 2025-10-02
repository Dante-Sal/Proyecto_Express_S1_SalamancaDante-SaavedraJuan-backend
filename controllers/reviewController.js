const { ReviewRepository } = require('../repositories/reviewRepository');

class ReviewController {
    constructor() {
        this.repository = new ReviewRepository();
        this.generateFile = this.generateFile.bind(this);
    };
    
    async generateFile(req, res) {
        
    };
};

module.exports = { ReviewController };