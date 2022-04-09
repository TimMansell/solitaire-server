import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import shuffle from 'lodash.shuffle';

export const createUser = async ({ db, uid }) => {
  const [first, second] = shuffle([adjectives, colors, animals]);

  const name = uniqueNamesGenerator({
    dictionaries: [first, second],
    separator: '',
    style: 'capital',
    length: 2,
  });

  const { value } = await db.collection('users').findOneAndUpdate(
    { uid },
    { $set: { name } },
    {
      projection: { _id: 0, uid: 0 },
      upsert: true,
      returnDocument: 'after',
    }
  );

  return value;
};

export const getUser = ({ db, uid }) =>
  db.collection('users').findOne({ uid }, { projection: { _id: 0, uid: 0 } });

export const getAllUsers = ({ db }) =>
  db
    .collection('users')
    .find({}, { projection: { _id: 0 } })
    .toArray();

export const getUserGames = ({ db, uid }, { offset, limit }) =>
  db
    .collection('games')
    .find({ uid }, { projection: { _id: 0, uid: 0 } })
    .skip(offset)
    .limit(limit)
    .sort({ date: -1 })
    .toArray();
