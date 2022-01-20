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
  const percentages = calculatePercents(counts);

  return { games, percentages };
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
    wonPercent: `percentages.won`,
  };

  const field = fieldMapping[showBest];

  const games = await db
    .collection('users')
    .find(
      { completed: { $gte: 25 }, [field]: { $gt: 0 } },
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
  const percentages = calculatePercents(counts);

  await db
    .collection('users')
    .findOneAndUpdate(
      { uid },
      { $set: { games, percentages } },
      { upsert: true }
    );

  return { games, percentages };
};

export const getPlayers = async (db) =>
  db.collection('users').find({}, {}).count();
