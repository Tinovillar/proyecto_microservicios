const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 4141;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }));
app.use(bodyParser.json());

app.get('/random/:number', async (req, res) => {
    const response = await fetch(`http://movies:4000/movies/random/${req.params.number}`);
    let result = await response.json();
    result = result.map((item) => ({
        id: item._id,
        title: item.title,
        plot: item.fullplot,
        year: item.year,
        rating: item.tomatoes?.viewer.rating ?? undefined,
        poster: item.poster
      }))
    res.json(result);
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})