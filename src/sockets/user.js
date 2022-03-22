import { createNewUser, getUserDetails, getUserGames } from '#@/db/user';
import { getPlayerCount } from './players';
import { formatHistoryGames } from './format';

export const createUser = async ({ io, socket, db, uid }) => {
  try {
    const isExistingUser = await getUserDetails(db, uid);

    if (isExistingUser) return;

    const user = await createNewUser(db, uid);

    socket.emit('user', user);

    getPlayerCount({ io, db });
  } catch (error) {
    console.log({ error });
  }
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
