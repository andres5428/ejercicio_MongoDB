const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();
const {URI,DB_DATABASE} = require('../config');

const clientPromise = mongodb.MongoClient.connect(URI); // Retorna una promesa

let data_try= [];

const validate = ((req,res,next)=>{
  
    if (data_try.length === 0){
      res.status(400).end("el valor no se encuentra")
      next(Error);
    }
    else {
      res.status(200).end(req.body.name);
      next();
    }
    res.status(500).json({message: error.message});
})


/**
 *  GET - Retorna todos los platos
 */
router.get('/food', async (req,res)=>{
    const client = await clientPromise;
    const database = client.db(DB_DATABASE);
    const collection = database.collection('comidas');
    console.log(collection)
    const data = await collection.find({}).toArray()
    res.json({data});
});



/**
 * GET - Buscar plato en específico
 */
router.get('/food/:name', async (req,res)=>{
  const client = await clientPromise;
  const database = client.db(DB_DATABASE);
  const collection = database.collection('comidas');
  console.log(collection)
  const data = await collection.find({"name":req.params.name}).toArray()
  console.log(data)
  data_try = data;
  res.json({data});
});

/**
 * Post - Ingresar un plato de comida
 */
router.post('/food', async (req,res)=>{
    const client = await clientPromise;
    const database = client.db(DB_DATABASE);
    const collection = database.collection('comidas');
    console.log(req.body)
    console.log(req.body.origin)
    try {
      const data = await collection.save({"name":req.body.name,"origin":req.body.origin});
      res.status(202).json(data);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
});

/**
 * Put - Modificar un plato de comida
 */
router.put('/food/', async (req,res)=>{
    const client = await clientPromise;
    const database = client.db(DB_DATABASE);
    const collection = database.collection('comidas');
    try {
      const data = await collection.update({"name":req.body.name},{"name":req.body.modifyname})
      res.status(202).json(data); // arreglar el $set
    } catch (error) {
      res.status(500).json({message: error.message});
    }
});

/**
 * Delete - Modificar un plato de comida
 */
router.delete('/food/', async (req,res)=>{
    const client = await clientPromise;
    const database = client.db(DB_DATABASE);
    const collection = database.collection('comidas');
    try {
      const data = await collection.remove({"name":req.body.name})
      res.status(202).json(data);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
});



module.exports = {
    users: router
}
