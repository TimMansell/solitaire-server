import { createNewUser, getUserDetails, getUserGames } from '#@/db/user';
import { formatHistoryGames } from './format';

export const createUser = async ({ socket, db, uid }) => {
  if (socket.user) return;

  try {
    const user = await createNewUser(db, uid);

    socket.emit('user', user);
  } catch (error) {
    console.log({ error });
  }
};

export const setUser = async ({ socket, db, uid }) => {
  try {
    const existingUser = await getUserDetails(db, uid);

    socket.user = existingUser;
    socket.emit('user', existingUser);
  } catch (error) {
    console.log({ error });
  }
};

export const setUserGames = async ({ socket, db, uid }, { offset, limit }) => {
  try {
    const [games, gamesPlayed] = await getUserGames(db, uid, offset, limit);

    const formattedGames = formatHistoryGames(games, gamesPlayed, offset);

    socket.emit('userGames', formattedGames);
  } catch (error) {
    console.log({ error });
  }
};
