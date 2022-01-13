import { Server } from 'socket.io';

import { setupOn } from './setup';
import { disconnect } from './disconnect';
import { getLatestVersion } from './version';
import { newGame, saveGame } from './game';
import { createUser, setUser, getUserHistory } from './user';
import { getCounts, getStats, getLeaderboards } from './stats';

// eslint-disable-next-line import/prefer-default-export
export const setupSockets = ({ server }, db) => {
  const io = new Server(server);

  io.on('connection', async (socket) => {
    const on = setupOn({ socket, db, io });

    on('newGame', newGame);
    on('saveGame', saveGame);
    on('createUser', createUser);
    on('setUser', setUser);
    on('getUserHistory', getUserHistory);
    on('getCounts', getCounts);
    on('getStats', getStats);
    on('getLeaderboards', getLeaderboards);
    on('disconnect', disconnect);

    getLatestVersion({ socket });

    console.log('Client connected.', socket.id);
  });
};
