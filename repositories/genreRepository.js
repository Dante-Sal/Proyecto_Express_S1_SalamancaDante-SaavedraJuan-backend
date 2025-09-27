const { MongoDBConnection } = require('../config/db');

class GenreRepository {
    constructor() {
        this.connection = new MongoDBConnection();
    };

    async list() {
        const collection = await this.connection.connect('genres');
        return await collection.find({}, { _id: 0 }).toArray();
    };

    async count() {
        const collection = await this.connection.connect('genres');
        return await collection.countDocuments();
    };

    async create(genre) {
        const collection = await this.connection.connect('genres');
        return await collection.insertOne(genre);
    };

    async update(code, genre) {
        const collection = await this.connection.connect('genres');
        return await collection.updateOne({ code }, { $set: genre });
    };

    async delete(_id) {
        const collection = await this.connection.connect('genres');
        return await collection.deleteOne({ code });
    };
};

module.exports = { GenreRepository };