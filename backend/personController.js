const { connect } = require('./db');
const { ObjectId } = require('mongodb');

async function createPerson(person) {
  const db = await connect();
  const result = await db.collection('persons').insertOne(person);
  return result;
}

async function getAllPersons() {
  const db = await connect();
  const persons = await db.collection('persons').find().toArray();
  return persons;
}

async function getPersonById(id) {
  const db = await connect();
  const person = await db.collection('persons').findOne({ _id: new ObjectId(id) });
  return person;
}

async function updatePerson(id, updatedFields) {
  const db = await connect();
  const result = await db.collection('persons').updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedFields }
  );
  return result;
}

async function deletePerson(id) {
  const db = await connect();
  const result = await db.collection('persons').deleteOne({ _id: new ObjectId(id) });
  return result;
}

module.exports = {
  createPerson,
  getAllPersons,
  getPersonById,
  updatePerson,
  deletePerson
};
