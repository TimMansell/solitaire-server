import { createUser, getUser, getUserGames } from '#@/db/user';
import { getUserGameCount } from '#@/db/stats';
import { formatHistoryGames } from './format';

export const emitCreateUser = async ({ socket, ...core }) => {
  if (socket.user) return;

  try {
    const user = await createUser(core);

    socket.user = user;
    socket.emit('user', user);
  } catch (error) {
    console.log({ error });
  }
};

export const emitUser = async ({ socket, ...core }) => {
  try {
    const user = await getUser(core);

    if (!user) return;

    socket.user = user;
    socket.emit('user', user);
  } catch (error) {
    console.log({ error });
  }
};

export const emitUserGames = async ({ socket, ...core }, params) => {
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
