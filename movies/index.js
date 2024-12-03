const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors');

const app = express();
const port = 4000;
let db = undefined;

const init = async () => {
  console.log('Conectando a la base de datos');
  const client = await MongoClient.connect('mongodb://mongodb:27017');
  console.log('Conectado a la base de datos');
  db = client.db('peliculas');
  console.log('Base de datos conectada');
}

init()

app.use(cors());
app.use(bodyParser.json())

app.get('/movies/random/:number', async (req, res) => {
  let items = await db.collection('movies').aggregate([{ "$sample": { "size": req.params.number/1 } }]).toArray()
  res.json(items);
})

app.get('/movies/title/:title', async (req, res) => {
  //db.collection('movies').find({'title':{$regex: `${req.params.title}`}});
  let items = await db.collection('movies').find({'title':{$regex: `${req.params.title}`, $options:'i'}}).toArray()
  res.json(items);
})

app.get('/movies/all', async (req, res) => {
  let movies = await db.collection('movies').find().toArray()
  res.json(movies)
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})