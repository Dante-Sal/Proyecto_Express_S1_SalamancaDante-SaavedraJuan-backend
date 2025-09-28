const { ObjectId } = require('mongodb');
const { MongoDBConnection } = require('../config/db');

class UserRepository {
    constructor() {
        this.connection = new MongoDBConnection();
        this.publicProjection = { projection: { password_hash: 0, password_updated_at: 0, created_at: 0, updated_at: 0 } };
    };

    async list() {
        const collection = await this.connection.connect('users');
        return await collection.find({}, this.publicProjection).toArray();
    };

    async listPasswords() {
        const collection = await this.connection.connect('users');
        return collection.find({}, { projection: { password_hash: 1 } });
    };

    async listRole(role) {
        const collection = await this.connection.connect('users');
        return await collection.find({ role }, this.publicProjection).toArray();
    };

    async count() {
        const collection = await this.connection.connect('users');
        return await collection.countDocuments();
    };

    async findById(_id) {
        const collection = await this.connection.connect('users');
        return await collection.findOne({ _id: new ObjectId(_id) });
    };

    async findPublicById(_id) {
        const collection = await this.connection.connect('users');
        return await collection.findOne({ _id: new ObjectId(_id) }, this.publicProjection);
    };

    async findPublicByEmail(email) {
        const collection = await this.connection.connect('users');
        return await collection.findOne({ email }, this.publicProjection);
    };

    async findCredentialsByEmailStatusCode(email, status_code) {
        const collection = await this.connection.connect('users');
        return await collection.findOne({ email, status_code }, { projection: { email: 1, password_hash: 1, role: 1 } });
    };

    async findPublicByUsername(username) {
        const collection = await this.connection.connect('users');
        return await collection.findOne({ username }, this.publicProjection);
    };

    async create(user) {
        const collection = await this.connection.connect('users');
        return await collection.insertOne(user);
    };

    async update(_id, user) {
        const collection = await this.connection.connect('users');
        return await collection.updateOne({ _id: new ObjectId(_id) }, { $set: user });
    };

    async updateStatus(_id, status_code) {
        const collection = await this.connection.connect('users');
        return await collection.updateOne({ _id: new ObjectId(_id) }, { $set: { status_code } });
    };

    async delete(_id) {
        const collection = await this.connection.connect('users');
        return await collection.deleteOne({ _id: new ObjectId(_id) });
    };
};

module.exports = { UserRepository };