import { versionUpdate, usersUpdate, gamesUpdate } from '../events/watch';
import {
  onSaveGame,
  onUserGames,
  onStats,
  onLeaderboards,
  onDisconnected,
} from '../events/on';
import { emitInitalGame } from '../emit/game';
import { emitUser } from '../emit/user';
import { emitUserPlayed, emitGlobalPlayed } from '../emit/stats';
import { emitPlayerCount, emitOnlineCount } from '../emit/players';
import { watchVersion, watchUsers, watchGames } from '#db/watch';

export const setupQuery =
  ({ db, io, params }) =>
  (fn, queryParams) =>
    fn({
      ...(db && { db }),
      ...(io && { io }),
      ...params,
      ...queryParams,
    });

export const setupEmit = (socket) => (name, data) => socket.emit(name, data);

export const setupOn = (socket) => (name, callback) =>
  socket.on(name, callback);

export const setupCore = (db, io, socket) => {
  const queryIo = setupQuery({ io });
  const queryDb = setupQuery({ db, params: socket.handshake.query });
  const queryParams = setupQuery({ params: socket.handshake.query });
  const on = setupOn(socket);
  const emit = setupEmit(socket);
  const globalEmit = setupEmit(io);

  return { queryParams, queryDb, queryIo, globalEmit, emit, on };
};

export const setupWatchEvents = (db, io) => {
  watchVersion(db).on('change', (record) => versionUpdate({ io, record }));
  watchUsers(db).on('change', () => usersUpdate({ io, db }));
  watchGames(db).on('change', (record) => gamesUpdate({ io, db, record }));
};

export const setupOnEvents = (core) => {
  onSaveGame(core);
  onUserGames(core);
  onStats(core);
  onLeaderboards(core);
  onDisconnected(core);
};

export const setupEmitEvents = async ({ globalEmit, ...core }) => {
  emitOnlineCount({ ...core, emit: globalEmit });
  emitUser(core);
  emitPlayerCount(core);
  emitUserPlayed(core);
  emitGlobalPlayed(core);
  emitInitalGame(core);
};
