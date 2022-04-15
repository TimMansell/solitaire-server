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

export const initMongoEvents = (server) =>
  [watchForVersionUpdate, watchForUsersUpdate, watchForGamesUpdate].forEach(
    (fn) => fn(server)
  );

export const initSocketEvents = (core) =>
  [
    onSaveGame,
    onUserGames,
    onStats,
    onLeaderboards,
    onDisconnected,
    emitUser,
    emitPlayerCount,
    emitGlobalPlayed,
    emitUserPlayed,
    emitOnlineCount,
    emitInitalGame,
  ].forEach((fn) => fn(core));
