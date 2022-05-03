import { MongoClient } from 'mongodb';
import EventEmitter from 'eventemitter3';
import 'dotenv/config';

const { MONGOBD_URI, MONGODB_USER, MONGOBD_PASS, MONGODB_DB } = process.env;

let dbConnection;

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

export const dbEmitter = new EventEmitter();
