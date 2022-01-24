import { Server } from 'socket.io';

import { setupOn } from './setup';
import { disconnect } from './disconnect';
import { getLatestVersion } from './version';
import { newGame, saveGame } from './game';
import { createUser, getUser, getUserHistory } from './user';
import {
  getUsersGamesPlayed,
  getGlobalGamesPlayed,
  getStats,
  getLeaderboards,
} from './stats';
import { getPlayerCount, getOnlinePlayerCount } from './players';

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
    on('getUsersGamesPlayed', getUsersGamesPlayed);
    on('getStats', getStats);
    on('getLeaderboards', getLeaderboards);
    on('disconnect', disconnect);

    getLatestVersion(core);
    getPlayerCount(core);
    getGlobalGamesPlayed(core);
    getOnlinePlayerCount(core);

    console.log('Client connected.', socket.id);
  });
};
