import { getLeaderboadSortBy, formatLeaderboardGames } from '@/services/stats';

export const getUserStats = async (db, uid) =>
  db.collection('userStats').findOne({ uid }, { _id: 0 });

export const getGlobalStats = async (db) =>
  db.collection('globalStats').findOne({}, { _id: 0 });

export const getUsersGames = (db, uid) =>
  db.collection('games').find({ uid }, { _id: 0 }).toArray();

export const getAllGames = (db) =>
  db.collection('games').find({}, { _id: 0 }).toArray();

export const getLeaderboards = async (db, showBest, limit) => {
  const sortBy = getLeaderboadSortBy(showBest);

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

  const formattedGames = formatLeaderboardGames(games, players, sortBy);

  return formattedGames;
};

export const updateStats = async (db, collection, stats) => {
  const { uid } = stats;

  return db
    .collection(collection)
    .findOneAndUpdate({ uid }, { $set: { ...stats } }, { upsert: true });
};
