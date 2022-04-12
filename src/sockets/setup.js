import {
  onSaveGame,
  onUserGames,
  onStats,
  onLeaderboards,
  onDisconnected,
} from './on';
import { emitInitalGame } from './emit/game';
import { emitUser } from './emit/user';
import { emitUserPlayed, emitGlobalPlayed } from './emit/stats';
import { emitPlayerCount, emitOnlineCount } from './emit/players';
import {
  watchForVersionUpdate,
  watchForUsersUpdate,
  watchForGamesUpdate,
} from './watch';

const setupOn =
  ({ socket, ...core }) =>
  (socketName, callback) =>
    socket.on(socketName, (params) => callback({ socket, ...core }, params));

export const initWatchEvents = (server) => {
  watchForVersionUpdate(server);
  watchForUsersUpdate(server);
  watchForGamesUpdate(server);
};

export const initOnEvents = (core) => {
  const on = setupOn(core);

  on('saveGame', onSaveGame);
  on('userGames', onUserGames);
  on('stats', onStats);
  on('leaderboards', onLeaderboards);
  on('disconnect', onDisconnected);
};

export const initEmitEvents = (core) => {
  emitUser(core);
  emitPlayerCount(core);
  emitGlobalPlayed(core);
  emitUserPlayed(core);
  emitOnlineCount(core);
  emitInitalGame(core);
};
