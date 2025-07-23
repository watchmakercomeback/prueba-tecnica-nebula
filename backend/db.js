const { MongoClient } = require('mongodb');

const uri = 'mongodb://mongo:27017';
//const uri = 'mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0';

const client = new MongoClient(uri);
let db;

async function connectWithRetry(retries = 5, delay = 2000) {
  if (db) return db;

  for (let i = 0; i < retries; i++) {
    try {
      await client.connect();
      db = client.db('peopleDB');
      console.log('✅ Conectado a MongoDB');
      return db;
    } catch (err) {
      console.error(`❌ Error conectando a MongoDB (intento ${i + 1}):`, err.message);
      if (i < retries - 1) {
        console.log(`⏳ Reintentando en ${delay / 1000} segundos...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw new Error('❌ Falló la conexión a MongoDB después de varios intentos');
      }
    }
  }
}

module.exports = { connect: connectWithRetry };
