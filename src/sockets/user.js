import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import { updateUser, getUserDetails, getGames } from '@/db/user';
import { updatePlayerCount } from '@/db/stats';
import { formatHistoryGames } from './format';

export const createUser = async ({ socket, db }, uid) => {
  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: '',
    style: 'capital',
  });

  await Promise.all([updateUser(db, uid, name), updatePlayerCount(db)]);

  socket.emit('setUser', name);
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
    const [games, gamesPlayed] = await getGames(db, uid, offset, limit);

    const formattedGames = formatHistoryGames(games, gamesPlayed, offset);

    socket.emit('getUserHistory', formattedGames);
  } catch (error) {
    console.log({ error });
  }
};
