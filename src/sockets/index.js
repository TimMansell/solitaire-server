import { Server } from 'socket.io';

import { setupOn } from './setup';
import { disconnect } from './disconnect';
import { checkVersion } from './version';
import { newGame, saveGame } from './game';
import { getUser, getUserHistory } from './user';
import {
  getUserPlayed,
  getGlobalPlayed,
  getStats,
  getLeaderboards,
} from './stats';
import { getPlayerCount, getOnlineCount } from './players';

// eslint-disable-next-line import/prefer-default-export
export const setupSockets = ({ server }, db) => {
  const io = new Server(server);

  io.on('connection', async (socket) => {
    const { uid } = socket.handshake.query;
    const core = { socket, io, db, uid };
    const on = setupOn(core);

    on('newGame', newGame);
    on('saveGame', saveGame);
    on('userHistory', getUserHistory);
    on('stats', getStats);
    on('leaderboards', getLeaderboards);
    on('disconnect', disconnect);

    checkVersion(core);
    getUser(core);
    getPlayerCount(core);
    getGlobalPlayed(core);
    getUserPlayed(core);
    getOnlineCount(core);

    console.log('Client connected.', uid);
  });
};
