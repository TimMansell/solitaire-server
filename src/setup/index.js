import { createServer } from 'http';
import express from 'express';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

export const setupDB = async () => {
  const { MONGOBD_URI, MONGODB_USER, MONGOBD_PASS, MONGODB_DB } = process.env;
  const URI = `mongodb+srv://${MONGODB_USER}:${MONGOBD_PASS}@${MONGOBD_URI}/test?retryWrites=true&w=majority`;

  const connection = await MongoClient.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = connection.db(MONGODB_DB);

  return db;
};

export const setupExpress = async () => {
  const APP_PORT = process.env.PORT || 5000;

  const app = express();
  const server = createServer(app).listen(APP_PORT);

  app.get('/', (req, res) => {
    res.send('Server is responding :)');
  });

  console.log(`http server listening on ${APP_PORT}`);

  return server;
};
