require('dotenv').config();
const { MongoClient } = require('mongodb');

class MongoDBConnection {
    constructor(collection) {
        this.client = new MongoClient(process.env.URI);
        this.database = process.env.DATABASE;
        this.collection = collection;
    };

    async connect() {
        if (!this.client.topology?.isConnected()) await this.client.connect();
        return this.client.db(this.database).collection(this.collection);
    };
};

module.exports = { MongoDBConnection };