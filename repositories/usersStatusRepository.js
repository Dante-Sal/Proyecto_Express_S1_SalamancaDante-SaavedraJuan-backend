const { MongoDBConnection } = require('../config/db');

class UsersStatusRepository {
    constructor() {
        this.connection = new MongoDBConnection();
    };

    async findByName(status) {
        const collection = await this.connection.connect('users_status');
        return await collection.findOne({ status });
    };
};

module.exports = { UsersStatusRepository };