import { Server } from 'socket.io';

import { setupOn } from './setup';
import { disconnect } from './disconnect';
import { getLatestVersion } from './version';
import { newGame, saveGame } from './game';
import { createUser, getUser, getUserHistory } from './user';
import {
  getGamesPlayed,
  getPlayerCount,
  getStats,
  getLeaderboards,
} from './stats';

// eslint-disable-next-line import/prefer-default-export
export const setupSockets = ({ server }, db) => {
  const io = new Server(server);

  io.on('connection', async (socket) => {
    const core = { socket, io, db };
    const on = setupOn(core);

    on('newGame', newGame);
    on('saveGame', saveGame);
    on('createUser', createUser);
    on('getUser', getUser);
    on('getUserHistory', getUserHistory);
    on('getGamesPlayed', getGamesPlayed);
    on('getStats', getStats);
    on('getLeaderboards', getLeaderboards);
    on('disconnect', disconnect);

    getLatestVersion(core);
    getPlayerCount(core);

    console.log('Client connected.', socket.id);
  });
};
