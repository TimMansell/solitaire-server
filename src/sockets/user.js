import { getUser, createNewUser, getGames } from '@/db/user';
import { updatePlayerStats } from '@/db/stats';
import { formatHistoryGames } from './format';

export const createUser = async ({ socket, db }, uid) => {
  const user = await getUser(db, uid);

  if (!user) {
    const newUser = await createNewUser(db, uid);

    await updatePlayerStats(db);

    socket.emit('setUser', newUser);

    return;
  }

  socket.emit('setUser', user);
};

export const setUser = async ({ socket, db }, uid) => {
  try {
    const user = await getUser(db, uid);

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
