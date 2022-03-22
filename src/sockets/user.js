import {
  uniqueNamesGenerator,
  NumberDictionary,
  colors,
  animals,
} from 'unique-names-generator';
import { updateUser, getUserDetails, getUserGames } from '#@/db/user';
import { getPlayers } from '#@/db/players';
import { formatHistoryGames } from './format';

export const createUser = async ({ io, socket, db, uid }) => {
  const isExistingUser = await getUserDetails(db, uid);

  if (isExistingUser) return;

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

  socket.emit('user', user);
  io.emit('playerCount', players);
};

export const getUser = async ({ socket, db, uid }) => {
  try {
    const existingUser = await getUserDetails(db, uid);

    socket.emit('user', existingUser);
  } catch (error) {
    console.log({ error });
  }
};

export const getUserHistory = async (
  { socket, db, uid },
  { offset, limit }
) => {
  try {
    const [games, gamesPlayed] = await getUserGames(db, uid, offset, limit);

    const formattedGames = formatHistoryGames(games, gamesPlayed, offset);

    socket.emit('userGames', formattedGames);
  } catch (error) {
    console.log({ error });
  }
};
