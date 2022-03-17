import {
  uniqueNamesGenerator,
  NumberDictionary,
  colors,
  animals,
} from 'unique-names-generator';
import { updateUser, getUserDetails, getUserGames } from '#@/db/user';
import { getPlayers } from '#@/db/players';
import { formatHistoryGames } from './format';

export const createUser = async ({ io, db }, uid, callback) => {
  const numberDictionary = NumberDictionary.generate({ min: 10, max: 999 });
  const name = uniqueNamesGenerator({
    dictionaries: [colors, animals, numberDictionary],
    separator: '',
    style: 'capital',
  });

  const [user, players] = await Promise.all([
    updateUser(db, uid, name),
    getPlayers(db),
  ]);

  io.emit('setPlayerCount', players);

  callback(user);
};

export const getUser = async ({ db }, uid, callback) => {
  try {
    const user = await getUserDetails(db, uid);

    callback(user);
  } catch (error) {
    console.log({ error });
  }
};

export const getUserHistory = async (
  { db },
  { uid, offset, limit },
  callback
) => {
  try {
    const [games, gamesPlayed] = await getUserGames(db, uid, offset, limit);

    const formattedGames = formatHistoryGames(games, gamesPlayed, offset);

    callback(formattedGames);
  } catch (error) {
    console.log({ error });
  }
};
