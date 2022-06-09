import { db } from './setup';
import { createUser } from './helpers/user';
import { formatGames } from './helpers/results';

export const getUserByUid = async ({ uid }) => {
  const { value } = await db()
    .collection('users')
    .findOneAndUpdate(
      { uid },
      [
        {
          $set: {
            name: { $ifNull: ['$name', createUser()] },
          },
        },
      ],
      {
        projection: { _id: 0, uid: 0 },
        upsert: true,
        returnDocument: 'after',
      }
    );

  return value;
};

export const getGamesByUid = ({ uid, offset, limit }) =>
  db()
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
                outcome: {
                  $switch: {
                    branches: [
                      { case: { $eq: [{ $toInt: '$won' }, 1] }, then: 'Won' },
                      { case: { $eq: [{ $toInt: '$lost' }, 1] }, then: 'Lost' },
                    ],
                    default: 'Gave Up',
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                uid: 0,
                won: 0,
                lost: 0,
                completed: 0,
              },
            },
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
