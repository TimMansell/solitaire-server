import { MongoClient } from 'mongodb';
import 'dotenv/config';
import { emitter } from '#src/eventEmitter';

const { MONGOBD_URI, MONGODB_USER, MONGOBD_PASS, MONGODB_DB } = process.env;

const URI = `mongodb+srv://${MONGODB_USER}:${MONGOBD_PASS}@${MONGOBD_URI}/test?retryWrites=true&w=majority`;

const connection = new MongoClient(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 2000,
});

let dbConnection;

connection.on('serverOpening', () => console.log('connecting to db'));
connection.on('serverClosed', () => console.log('connection to db failed'));
connection.on('open', () => console.log('connected to db'));
connection.on('connectionClosed', () => console.log('connection closed'));

connection.on('serverHeartbeatSucceeded', () => emitter.emit('dbIsUp'));
connection.on('serverHeartbeatFailed', () => emitter.emit('dbIsDown'));

export const setupDB = async () => {
  try {
    await connection.connect();
    await connection.db('admin').command({ ping: 1 });

    dbConnection = connection.db(MONGODB_DB);

    return dbConnection;
  } catch (error) {
    console.log({ error });
    await connection.close();
  }
};

export const db = () => dbConnection;
