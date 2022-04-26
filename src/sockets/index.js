import { Server } from 'socket.io';
import { setupBroadcast } from './events/emit';
import { versionUpdate, usersUpdate, gamesUpdate } from './events/watch';
import {
  onSaveGame,
  onUserGames,
  onStats,
  onLeaderboards,
  onDisconnected,
} from './events/on';
import { setupWatcher, setupQuery, setupEmit } from './setup';
import { watchVersion, watchUsers, watchGames } from '#@/db/watch';
import { getUser } from '#@/db/user';

// eslint-disable-next-line import/prefer-default-export
export const setupSockets = ([express, db]) => {
  const io = new Server(express);

  const globalEmit = setupEmit(io);
  const watch = setupWatcher(db, io);

  watch(watchVersion, versionUpdate);
  watch(watchUsers, usersUpdate);
  watch(watchGames, gamesUpdate);

  io.on('connection', async (socket) => {
    const queryIo = setupQuery({ io });
    const queryDb = setupQuery({ db, params: socket.handshake.query });
    const queryParams = setupQuery({ params: socket.handshake.query });
    const emit = setupEmit(socket);

    const core = { queryParams, queryDb, queryIo, globalEmit, emit };

    socket.on('saveGame', (params) => onSaveGame(core, params));
    socket.on('userGames', (params) => onUserGames(core, params));
    socket.on('stats', () => onStats(core));
    socket.on('leaderboards', (params) => onLeaderboards(core, params));
    socket.on('disconnect', () => {
      onDisconnected(core);

      socket.removeAllListeners();
    });

    setupBroadcast(core);

    socket.user = await queryDb(getUser);

    console.log('Client connected.');
  });
};
