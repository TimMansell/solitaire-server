import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import { formatHistoryGames } from '@/services/stats';

export const createNewUser = (db, uid) => {
  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: '',
    style: 'capital',
  });

  return db.collection('users').insertOne({ uid, name });
};

export const getUser = async (db, uid) => {
  const user = await db
    .collection('users')
    .findOne({ uid }, { projection: { _id: 0, name: 1 } });

  return user;
};

export const getUsers = async (db) => {
  const users = await db
    .collection('users')
    .find({}, { projection: { uid: 1 } })
    .toArray();

  return users;
};

export const getGames = async (db, uid, offset, limit) => {
  const findGames = await db
    .collection('games')
    .find(
      { uid },
      { projection: { date: 1, won: 1, lost: 1, time: 1, moves: 1 } }
    )
    .skip(offset)
    .limit(limit)
    .sort({ date: -1 })
    .toArray();

  const findGamesPlayed = db
    .collection('games')
    .find({ uid }, { projection: { date: 1 } })
    .count();

  const [games, gamesPlayed] = await Promise.all([findGames, findGamesPlayed]);

  const formattedGames = formatHistoryGames(games, gamesPlayed, offset);

  return formattedGames;
};
