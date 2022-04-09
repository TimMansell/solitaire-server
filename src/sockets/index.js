import { Server } from 'socket.io';

import { setupOn } from './setup';
import { disconnect } from './disconnect';
import {
  watchForVersionUpdate,
  watchForUsersUpdate,
  watchForGamesUpdate,
} from './watch';
import { initGame, saveGame } from './game';
import { emitUser, emitUserGames } from './user';
import {
  emitUserPlayed,
  emitGlobalPlayed,
  emitStats,
  emitLeaderboards,
} from './stats';
import { emitPlayerCount, emitOnlineCount } from './players';

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
    on('disconnect', disconnect);

    initGame(core);
    emitUser(core);
    emitPlayerCount(core);
    emitGlobalPlayed(core);
    emitUserPlayed(core);
    emitOnlineCount(core);

    console.log('Client connected.', core.uid);
  });
};
