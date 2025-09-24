const { ObjectId } = require('mongodb');
const { MongoDBConnection } = require('../config/db');

class UserRepository {
    constructor() {
        this.connection = new MongoDBConnection('users');
        this.publicProjection = { projection: { _id: 0, password_hash: 0, password_updated_at: 0, status_code: 0, created_at: 0, updated_at: 0 } };
    };

    async list() {
        const collection = await this.connection.connect();
        return await collection.find({}, this.publicProjection).toArray();
    };

    async listRole(role) {
        const collection = await this.connection.connect();
        return await collection.find({ role }, this.publicProjection).toArray();
    };

    async count() {
        const collection = await this.connection.connect();
        return await collection.countDocuments();
    };

    async findById(_id) {
        const collection = await this.connection.connect();
        return await collection.findOne({ _id }, this.publicProjection).toArray();
    };

    async findByEmail(email) {
        const collection = await this.connection.connect();
        return await collection.findOne({ email }, this.publicProjection).toArray();
    };

    async findByUsername(username) {
        const collection = await this.connection.connect();
        return await collection.findOne({ username }, this.publicProjection).toArray();
    };

    async create(user) {
        const collection = await this.connection.connect();
        return await collection.insertOne(user);
    };

    async update(user) {
        const collection = await this.connection.connect();
        return await collection.updateOne({ _id }, { $set: user });
    };

    async updateStatus(_id, status_code) {
        const collection = await this.connection.connect();
        return await collection.updateOne({ _id }, { $set: { status_code } });
    };

    async delete(_id) {
        const collection = await this.connection.connect();
        return await collection.deleteOne({ _id });
    };
};

module.exports = { UserRepository };