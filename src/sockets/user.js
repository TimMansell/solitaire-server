import { getUser, createNewUser } from '@/db/user';
import { updatePlayerStats } from '@/db/stats';
import { emitSetUser, emitGetUserHistory } from './emit/user';

export const createUser = ({ socket, db }) => {
  socket.on('createUser', async (uid) => {
    const user = await getUser(db, uid);

    if (!user) {
      await createNewUser(db, uid);
      await updatePlayerStats(db);
    }

    emitSetUser({ socket, db, uid });
  });
};

export const setUser = ({ socket, db }) => {
  socket.on('setUser', (uid) => {
    emitSetUser({ socket, db, uid });
  });
};

export const getUserHistory = ({ socket, db }) => {
  socket.on('getUserHistory', ({ uid, offset, limit }) => {
    emitGetUserHistory({ socket, db, uid, offset, limit });
  });
};
