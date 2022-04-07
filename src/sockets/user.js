import { createNewUser, getUser, getUserGames } from '#@/db/user';
import { getUserGameCount } from '#@/db/stats';
import { formatHistoryGames } from './format';

export const createUser = async ({ socket, ...core }) => {
  if (socket.user) return;

  try {
    const { name } = await createNewUser(core);

    socket.user = name;
    socket.emit('user', name);
  } catch (error) {
    console.log({ error });
  }
};

export const setUser = async ({ socket, ...core }) => {
  try {
    const { name } = await getUser(core);

    if (!name) return;

    socket.user = name;
    socket.emit('user', name);
  } catch (error) {
    console.log({ error });
  }
};

export const setUserGames = async ({ socket, ...core }, params) => {
  try {
    const [games, gamesPlayed] = await Promise.all([
      getUserGames(core, params),
      getUserGameCount(core),
    ]);

    const formattedGames = formatHistoryGames(games, gamesPlayed, params);

    socket.emit('userGames', formattedGames);
  } catch (error) {
    console.log({ error });
  }
};
