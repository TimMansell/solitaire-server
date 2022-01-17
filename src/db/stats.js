import { calculateStats } from './format';

export const getUserStats = async (db, uid) =>
  db.collection('users').findOne({ uid }, { _id: 0 });

export const getGlobalStats = async (db) =>
  db.collection('globalStats').findOne({}, { _id: 0 });

export const getAllGames = (db) =>
  db.collection('games').find({}, { _id: 0 }).toArray();

export const getLeaderboard = async (db, sortBy, limit) => {
  const games = await db
    .collection('games')
    .find(
      { won: true },
      { projection: { _id: 0, date: 1, uid: 1, time: 1, moves: 1 } }
    )
    .limit(limit)
    .sort({ [sortBy]: 1, date: 1 })
    .toArray();

  const uids = [...new Set(games.map(({ uid }) => uid))];

  const players = await db
    .collection('users')
    .find({ uid: { $in: uids } }, { projection: { _id: 0, uid: 1, name: 1 } })
    .toArray();

  return [games, players];
};

export const updateUserStats = async (db, uid) => {
  const [counts] = await db
    .collection('games')
    .aggregate([
      {
        $facet: {
          completed: [
            { $match: { uid, completed: true } },
            { $count: 'completed' },
          ],
          won: [{ $match: { uid, won: true } }, { $count: 'won' }],
          lost: [{ $match: { uid, lost: true } }, { $count: 'lost' }],
          quit: [
            { $match: { uid, won: false, lost: false, completed: true } },
            { $count: 'quit' },
          ],
        },
      },
      {
        $project: {
          completed: { $arrayElemAt: ['$completed.completed', 0] },
          won: { $arrayElemAt: ['$won.won', 0] },
          lost: { $arrayElemAt: ['$lost.lost', 0] },
          quit: { $arrayElemAt: ['$quit.quit', 0] },
        },
      },
    ])
    .toArray();

  const stats = calculateStats(counts);

  await db
    .collection('users')
    .findOneAndUpdate({ uid }, { $set: { ...stats } }, { upsert: true });

  return stats;
};

export const updateGlobalStats = async (db) => {
  const [counts] = await db
    .collection('games')
    .aggregate([
      {
        $facet: {
          completed: [{ $match: { completed: true } }, { $count: 'completed' }],
          won: [{ $match: { won: true } }, { $count: 'won' }],
          lost: [{ $match: { lost: true } }, { $count: 'lost' }],
          quit: [
            { $match: { won: false, lost: false, completed: true } },
            { $count: 'quit' },
          ],
        },
      },
      {
        $project: {
          completed: { $arrayElemAt: ['$completed.completed', 0] },
          won: { $arrayElemAt: ['$won.won', 0] },
          lost: { $arrayElemAt: ['$lost.lost', 0] },
          quit: { $arrayElemAt: ['$quit.quit', 0] },
        },
      },
    ])
    .toArray();

  const stats = calculateStats(counts);

  await db
    .collection('globalStats')
    .findOneAndUpdate({}, { $set: { ...stats } }, { upsert: true });

  return stats;
};

export const updatePlayerCount = async (db) => {
  const players = await db.collection('users').find({}, {}).count();

  await db
    .collection('globalStats')
    .findOneAndUpdate({}, { $set: { players } }, { upsert: true });

  return players;
};
