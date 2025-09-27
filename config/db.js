require('dotenv').config();
const { MongoClient } = require('mongodb');

class MongoDBConnection {
    constructor() {
        this.client = new MongoClient(process.env.URI?.trim() ?? 'mongodb://localhost:27017/');
        this.database = process.env.DATABASE?.trim() ?? 'database';
    };

    async connect(collName) {
        if (!this.client.topology?.isConnected()) await this.client.connect();
        return this.client.db(this.database).collection(collName);
    };

    async startSession() {
        if (!this.client.topology?.isConnected()) await this.client.connect();
        return this.client.startSession();
    };
};

module.exports = { MongoDBConnection };