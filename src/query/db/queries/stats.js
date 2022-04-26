import { getStatsFields, getLeaderboardFields } from './helpers/fields';
import { formatStats, formatLeaderboards } from './helpers/results';

export const getStats = ({ db, uid }) => {
  const queries = getStatsFields();

  return db
    .collection('games')
    .aggregate([
      {
        $facet: {
          userStats: [{ $match: { uid } }, ...queries],
          globalStats: [...queries],
        },
      },
      {
        $project: {
          combined: {
            $cond: {
              if: { $eq: [{ $size: '$userStats' }, 0] },
              then: {
                $concatArrays: [
                  [
                    {
                      completed: 0,
                      won: 0,
                      lost: 0,
                      quit: 0,
                      wonPercent: 0,
                      lostPercent: 0,
                      quitPercent: 0,
                    },
                  ],
                  '$globalStats',
                ],
              },
              else: { $concatArrays: ['$userStats', '$globalStats'] },
            },
          },
        },
      },
      { $unwind: '$combined' },
      { $replaceRoot: { newRoot: '$combined' } },
    ])
    .map(formatStats)
    .toArray();
};

export const getPlayers = ({ db }) => db.collection('users').countDocuments({});

export const getOnlinePlayers = ({ io }) => io.engine.clientsCount;

export const getUserGameCount = ({ db, uid }) =>
  db.collection('games').countDocuments({ uid });

export const getGlobalGameCount = ({ db }) =>
  db.collection('games').countDocuments({});

export const getLeaderboards = ({ db, showBest, limit }) => {
  const { matches, sortBy, lookupField, project } =
    getLeaderboardFields(showBest);

  return db
    .collection('games')
    .aggregate([
      ...matches,
      { $sort: { ...sortBy, date: 1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: lookupField,
          foreignField: 'uid',
          pipeline: [{ $project: { _id: 0, name: 1 } }],
          as: 'user',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ['$user', 0] }, '$$ROOT'],
          },
        },
      },
      {
        $setWindowFields: {
          sortBy,
          output: {
            rank: {
              $documentNumber: {},
            },
          },
        },
      },
      { $project: { _id: 0, rank: 1, name: 1, ...project } },
    ])
    .map(formatLeaderboards)
    .toArray();
};
