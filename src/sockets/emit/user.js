import { getUser, getGames } from '@/db/user';

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
    const games = await getGames(db, uid, offset, limit);

    socket.emit('getUserHistory', games);
  } catch (error) {
    console.log({ error });
  }
};
