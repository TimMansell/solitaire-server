import { Server } from 'socket.io';

import { setupExpress, setupDB, setupGraphQl } from './setup';
import {
  setupOnSocket,
  checkVersion,
  newGame,
  saveGame,
  setUser,
  getUserHistory,
  getUserCounts,
  getGlobalCounts,
  getStats,
  getLeaderboards,
  disconnect,
} from './sockets';

const main = async () => {
  const [express, db] = await Promise.all([setupExpress(), setupDB()]);
  const io = new Server(express.server);

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

  setupGraphQl(express);
};

main();
