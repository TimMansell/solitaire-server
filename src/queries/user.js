import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import shuffle from 'lodash.shuffle';
import { formatGames } from './helpers/format';

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

export const getUserGames = ({ db, uid, offset, limit }) =>
  db
    .collection('games')
    .aggregate([
      { $match: { uid } },
      {
        $facet: {
          played: [{ $count: 'count' }],
          games: [
            { $sort: { date: -1 } },
            { $skip: offset },
            { $limit: limit },
            {
              $setWindowFields: {
                sortBy: { date: -1 },
                output: {
                  rank: {
                    $documentNumber: {},
                  },
                },
              },
            },
            {
              $set: {
                rank: { $add: [offset, { $subtract: ['$rank', 1] }] },
              },
            },
            { $project: { _id: 0, uid: 0 } },
          ],
        },
      },
      {
        $set: {
          'games.played': { $sum: '$played.count' },
        },
      },
      { $unwind: '$games' },
      { $replaceRoot: { newRoot: '$games' } },
    ])
    .map(formatGames)
    .toArray();
