import { calculateResults, calculatePercents } from './format';

export const getUserStats = async (db, uid) =>
  db.collection('users').findOne({ uid }, { _id: 0 });

export const getGlobalStats = async (db) => {
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

  const games = calculateResults(counts);
  const stats = calculatePercents(counts);

  return { games, stats };
};

export const getAllGames = (db) =>
  db.collection('games').find({}, { _id: 0 }).toArray();

export const getGameLeaderboards = async (db, { showBest, limit }) => {
  const games = await db
    .collection('games')
    .find(
      { won: true },
      { projection: { _id: 0, date: 1, uid: 1, [showBest]: 1 } }
    )
    .limit(limit)
    .sort({ [showBest]: 1, date: 1 })
    .toArray();

  return games;
};

export const getUserLeaderboards = async (db, { showBest, limit }) => {
  const fieldMapping = {
    winPercent: {
      field: 'stats.won',
      completed: 25,
    },
    wins: {
      field: 'games.won',
      completed: 0,
    },
  };

  const { field, completed } = fieldMapping[showBest];

  const games = await db
    .collection('users')
    .find(
      { 'games.completed': { $gte: completed }, [field]: { $gt: 0 } },
      { projection: { _id: 0, uid: 1, [field]: 1 } }
    )
    .limit(limit)
    .sort({ [field]: -1 })
    .toArray();

  return games;
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

  const games = calculateResults(counts);
  const stats = calculatePercents(counts);

  await db
    .collection('users')
    .findOneAndUpdate({ uid }, { $set: { games, stats } }, { upsert: true });

  return { games, stats };
};
