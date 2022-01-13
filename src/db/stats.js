import { getUsers } from '@/db/user';
import { calculateStats } from './format';

export const getUserStats = async (db, uid) =>
  db.collection('userStats').findOne({ uid }, { _id: 0 });

export const getGlobalStats = async (db) =>
  db.collection('globalStats').findOne({}, { _id: 0 });

export const getUsersGames = (db, uid) =>
  db.collection('games').find({ uid }, { _id: 0 }).toArray();

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
  const usersGames = await getUsersGames(db, uid);

  const stats = calculateStats(usersGames);

  return db
    .collection('userStats')
    .findOneAndUpdate({ uid }, { $set: { ...stats } }, { upsert: true });
};

export const updateGlobalStats = async (db) => {
  const games = await getAllGames(db);

  const stats = calculateStats(games);

  return db
    .collection('globalStats')
    .findOneAndUpdate({}, { $set: { ...stats } }, { upsert: true });
};

export const updatePlayerStats = async (db) => {
  const users = await getUsers(db);

  const stats = { players: users.length };

  return db
    .collection('globalStats')
    .findOneAndUpdate({}, { $set: { ...stats } }, { upsert: true });
};
