import { createUser, getUser, getGames, getGamesPlayed } from '@/db/user';
import { formatHistoryGames } from '@/services/stats';

export const emitSetUser = async ({ socket, db, uid, create = false }) => {
  try {
    const user = await getUser(db, uid);

    if (user) {
      socket.emit('setUser', user);
      return;
    }

    if (create) {
      const newUser = await createUser(db, uid);

      socket.emit('setUser', newUser);
    }
  } catch (error) {
    console.log({ error });
  }
};

export const emitGetUserHistory = async ({
  socket,
  db,
  uid,
  offset,
  limit,
}) => {
  try {
    const [games, gamesPlayed] = await Promise.all([
      getGames(db, uid, offset, limit),
      getGamesPlayed(db, uid),
    ]);

    const formattedGames = formatHistoryGames(games, gamesPlayed, offset);

    socket.emit('getUserHistory', formattedGames);
  } catch (error) {
    console.log({ error });
  }
};
