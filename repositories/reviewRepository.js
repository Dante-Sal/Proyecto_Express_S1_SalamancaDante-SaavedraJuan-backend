const { ObjectId } = require('mongodb');
const { MongoDBConnection } = require('../config/db');

class ReviewRepository {
    constructor() {
        this.connection = new MongoDBConnection();
    };

    async listById(catalog_id) {
        const collection = await this.connection.connect('reviews');
        return await collection.aggregate([
            { $match: { catalog_id: new ObjectId(catalog_id) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $project: {
                    _id: 0,
                    user_name: '$user.username',
                    score: 1,
                    review: 1,
                    created_at: '$created_at'
                }
            }
        ]).toArray();
    };
};

module.exports = { ReviewRepository };