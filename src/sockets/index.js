import { Server } from 'socket.io';

import { setupOnSocket } from './setup';
import { disconnect } from './disconnect';
import { checkVersion } from './version';
import { newGame, saveGame } from './game';
import { setUser, getUserHistory } from './user';
import {
  getUserCounts,
  getGlobalCounts,
  getStats,
  getLeaderboards,
} from './stats';

// eslint-disable-next-line import/prefer-default-export
export const setupSockets = ({ server }, db) => {
  const io = new Server(server);

  io.on('connection', async (socket) => {
    const on = setupOnSocket({ socket, db, io });

    on(checkVersion);
    on(newGame);
    on(saveGame);
    on(setUser);
    on(getUserHistory);
    on(getUserCounts);
    on(getGlobalCounts);
    on(getStats);
    on(getLeaderboards);
    on(disconnect);

    console.log('Client connected.', socket.id);
  });
};
