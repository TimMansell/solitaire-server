import { MongoClient } from 'mongodb';
import 'dotenv/config';

const { MONGOBD_URI, MONGODB_USER, MONGOBD_PASS, MONGODB_DB } = process.env;

const URI = `mongodb+srv://${MONGODB_USER}:${MONGOBD_PASS}@${MONGOBD_URI}/?retryWrites=true&w=majority`;

const connection = new MongoClient(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 20000,
});

let dbConnection;

connection.on('open', () => console.log('connected to db'));
connection.on('close', () => console.log('connection to db closed'));

export const setupDB = async () => {
  try {
    await connection.connect();

    dbConnection = connection.db(MONGODB_DB);
  } catch (error) {
    await connection.close();

    throw new Error(error);
  }

  return dbConnection;
};

export const db = () => dbConnection;
