const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();
const { URI, DB_DATABASE } = require('../config');

const clientPromise = mongodb.MongoClient.connect(URI); // Retorna una promesa

async function validate(req, res, next) {
  const client = await clientPromise;
  const database = client.db(DB_DATABASE);
  const collection = database.collection('comidas');
  const data = await collection.find({ "name": req.params.name }).toArray()
  if (data.length === 0) {
    return res.status(404).json({ message: 'El plato no existe' })
  }
  else {
    next()
  }
}


/**
 *  GET - Retorna todos los platos
 */
router.get('/food', async (req, res) => {
  const client = await clientPromise;
  const database = client.db(DB_DATABASE);
  const collection = database.collection('comidas');
  console.log(collection)
  const data = await collection.find({}).toArray()
  res.json({ data });
});



/**
 * GET - Buscar plato en específico
 */
router.get('/food/:name', validate, async (req, res) => {
  const client = await clientPromise;
  const database = client.db(DB_DATABASE);
  const collection = database.collection('comidas');
  const data = await collection.find({ "name": req.params.name }).toArray()
  data_try = data;
  res.json({ data });
});

/**
 * Post - Ingresar un plato de comida
 */
router.post('/food', async (req, res) => {
  const client = await clientPromise;
  const database = client.db(DB_DATABASE);
  const collection = database.collection('comidas');
  try {
    const data = await collection.save({ "name": req.body.name, "origin": req.body.origin });
    res.status(202).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Put - Modificar un plato de comida
 */
router.put('/food/:name',validate, async (req, res) => {
  const client = await clientPromise;
  const database = client.db(DB_DATABASE);
  const collection = database.collection('comidas');
  try {
    const data = await collection.update({ "name": req.params.name }, { "name": req.body.modifyname })
    res.status(202).json(data); // arreglar el $set
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Delete - Modificar un plato de comida
 */
router.delete('/food/:name', validate,async (req, res) => {
  const client = await clientPromise;
  const database = client.db(DB_DATABASE);
  const collection = database.collection('comidas');
  try {
    const data = await collection.remove({ "name": req.params.name })
    res.status(202).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = {
  users: router
}
