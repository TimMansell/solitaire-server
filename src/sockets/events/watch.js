import { emitNewUpdate } from '../emit/app';
import { emitPlayerCount } from '../emit/players';
import { emitUserPlayed, emitGlobalPlayed } from '../emit/stats';
import { emitCreateUser } from '../emit/user';
import { setupQuery, setupEmit } from '../setup';

export const versionUpdate = async ({ io, record }) => {
  const { appVersion } = record.updateDescription.updatedFields;
  const sockets = await io.fetchSockets();

  if (!appVersion) return;

  sockets.forEach(async (socket) => {
    const queryParams = setupQuery({
      params: { ...socket.handshake.query, appVersion },
    });
    const emit = setupEmit(socket);

    emitNewUpdate({ queryParams, emit });
  });
};

export const usersUpdate = async ({ io, db }) => {
  const queryDb = setupQuery({ db });
  const globalEmit = setupEmit(io);

  emitPlayerCount({ queryDb, emit: globalEmit });
};

export const gamesUpdate = async ({ io, db, record }) => {
  const sockets = await io.fetchSockets();
  const socket = sockets.find(
    ({ handshake }) => handshake.query.uid === record.fullDocument.uid
  );

  const queryDb = setupQuery({ db, params: socket.handshake.query });
  const globalEmit = setupEmit(io);
  const emit = setupEmit(socket);

  emitUserPlayed({ queryDb, emit });
  emitGlobalPlayed({ queryDb, emit: globalEmit });

  if (!socket.user) {
    emitCreateUser({ queryDb, emit });
  }
};
