const { MongoClient } = require('mongodb');

//const uri = 'mongodb://mongo:27017';
const uri = 'mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0';

const client = new MongoClient(uri);

let db;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db('peopleDB');
    console.log('🔗 Conectado a MongoDB');
  }
  return db;
}

module.exports = { connect };
