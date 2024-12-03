const amqp = require('amqplib/callback_api');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

RABBITMQ_QUEUE = 'movie_history';
const app = express();
app.use(cors());
app.use(bodyParser.json());

let movieRecord = [];

async function sendToQueue(message) {
  amqp.connect('amqp://rabbitmq:5672', function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
  
      channel.assertQueue(RABBITMQ_QUEUE, {
        durable: true
      });
  
      channel.sendToQueue(RABBITMQ_QUEUE, Buffer.from(message));
    });
  });
}

app.post('/viewed', async (req, res) => {
    const { movieId, movieTitle } = req.body;
  
    if (!movieId || !movieTitle) {
      return res.status(400).send({ error: 'Missing required fields' });
    }
  
    movieRecord.push(req.body);

    console.log(movieRecord);
  
    const message = JSON.stringify({ movieId, movieTitle });
    await sendToQueue(message);
  
    res.send({ message: 'Movie added to history and sent to queue', data: { movieId, movieTitle } });
});
  
const PORT = 3010;
app.listen(PORT, () => {
    console.log(`Movie record microservice is running on http://localhost:${PORT}`);
});