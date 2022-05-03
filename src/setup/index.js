// import { createServer } from 'http';
import express from 'express';
import { MongoClient } from 'mongodb';
import { WebSocketServer } from 'ws';
import 'dotenv/config';
import EventEmitter from 'eventemitter3';

const { MONGOBD_URI, MONGODB_USER, MONGOBD_PASS, MONGODB_DB } = process.env;

let dbConnection;

export const emitter = new EventEmitter();

export const setupDB = async () => {
  const URI = `mongodb+srv://${MONGODB_USER}:${MONGOBD_PASS}@${MONGOBD_URI}/test?retryWrites=true&w=majority`;

  dbConnection = await MongoClient.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('db connected');

  return dbConnection;
};

export const db = () => dbConnection.db(MONGODB_DB);

export const setupExpress = () => {
  const APP_PORT = process.env.PORT || 5000;

  const app = express();
  const server = app.listen(APP_PORT, () => {
    console.log(`Express is listening on port ${APP_PORT}`);
  });

  app.get('/', (req, res) => {
    res.send('Server is responding :)');
  });

  return server;
};

export const setupSockets = (server) => new WebSocketServer({ server });
