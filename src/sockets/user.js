import {
  uniqueNamesGenerator,
  NumberDictionary,
  colors,
  animals,
} from 'unique-names-generator';
import { updateUser, getUserDetails, getUserGames } from '#@/db/user';
import { getPlayers } from '#@/db/players';
import { formatHistoryGames } from './format';

export const createUser = async ({ socket, io, db }, uid) => {
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

  socket.emit('setUser', user);
  io.emit('setPlayerCount', players);
};

export const getUser = async ({ socket, db }, uid) => {
  try {
    const user = await getUserDetails(db, uid);

    socket.emit('setUser', user);
  } catch (error) {
    console.log({ error });
  }
};

export const getUserHistory = async (
  { socket, db },
  { uid, offset, limit }
) => {
  try {
    const [games, gamesPlayed] = await getUserGames(db, uid, offset, limit);

    const formattedGames = formatHistoryGames(games, gamesPlayed, offset);

    socket.emit('setUserHistory', formattedGames);
  } catch (error) {
    console.log({ error });
  }
};
