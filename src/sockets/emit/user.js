import { getUser, getGames } from '@/db/user';
import { formatHistoryGames } from './format';

export const emitSetUser = async ({ socket, db, uid }) => {
  try {
    const user = await getUser(db, uid);

    socket.emit('setUser', user);
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
    const [games, gamesPlayed] = await getGames(db, uid, offset, limit);

    const formattedGames = formatHistoryGames(games, gamesPlayed, offset);

    socket.emit('getUserHistory', formattedGames);
  } catch (error) {
    console.log({ error });
  }
};
