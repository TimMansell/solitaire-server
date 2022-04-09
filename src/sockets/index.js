import { Server } from 'socket.io';

import { setupOn } from './setup';
import {
  watchForVersionUpdate,
  watchForUsersUpdate,
  watchForGamesUpdate,
} from './watch';
import { emitUser, emitUserGames } from './emit/user';
import {
  emitUserPlayed,
  emitGlobalPlayed,
  emitStats,
  emitLeaderboards,
} from './emit/stats';
import { emitPlayerCount, emitOnlineCount } from './emit/players';
import { initGame, saveGame, disconnectUser } from './game';

// eslint-disable-next-line import/prefer-default-export
export const setupSockets = ([express, db]) => {
  const io = new Server(express);
  const server = { io, db };

  watchForVersionUpdate(server);
  watchForUsersUpdate(server);
  watchForGamesUpdate(server);

  io.on('connection', (socket) => {
    const core = { ...server, socket, ...socket.handshake.query };
    const on = setupOn(core);

    on('saveGame', saveGame);
    on('userGames', emitUserGames);
    on('stats', emitStats);
    on('leaderboards', emitLeaderboards);
    on('disconnect', disconnectUser);

    emitUser(core);
    emitPlayerCount(core);
    emitGlobalPlayed(core);
    emitUserPlayed(core);
    emitOnlineCount(core);

    initGame(core);

    console.log('Client connected.', core.uid);
  });
};
