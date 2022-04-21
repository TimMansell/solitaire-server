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
    const emit = setupEmit(socket);
    const { version } = socket.handshake.query;

    emitNewUpdate({ emit, version, appVersion });
  });
};

export const usersUpdate = async ({ io, db }) => {
  const query = setupQuery(db);
  const globalEmit = setupEmit(io);

  emitPlayerCount({ query, emit: globalEmit });
};

export const gamesUpdate = async ({ io, db, record }) => {
  const sockets = await io.fetchSockets();
  const socket = sockets.find(
    ({ handshake }) => handshake.query.uid === record.fullDocument.uid
  );

  const query = setupQuery(db, socket);
  const globalEmit = setupEmit(io);
  const emit = setupEmit(socket);

  emitUserPlayed({ query, emit });
  emitGlobalPlayed({ query, emit: globalEmit });

  if (!socket.user) {
    emitCreateUser({ query, emit });
  }
};
