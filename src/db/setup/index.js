import { MongoClient } from 'mongodb';
import 'dotenv/config';

const { MONGOBD_URI, MONGODB_USER, MONGOBD_PASS, MONGODB_DB } = process.env;

let dbConnection;

export const setupDB = async () => {
  const URI = `mongodb+srv://${MONGODB_USER}:${MONGOBD_PASS}@${MONGOBD_URI}/test?retryWrites=true&w=majority`;

  const connection = await MongoClient.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('db connected');

  dbConnection = connection.db(MONGODB_DB);

  return dbConnection;
};

export const db = () => dbConnection;
