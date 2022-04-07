import { Server } from 'socket.io';

import { setupOn } from './setup';
import { disconnect } from './disconnect';
import {
  watchForVersionUpdate,
  watchForUsersUpdate,
  watchForGamesUpdate,
} from './watch';
import { initNewGame, saveGame } from './game';
import { setUser, setUserGames } from './user';
import {
  setUserPlayed,
  setGlobalPlayed,
  setStats,
  setLeaderboards,
} from './stats';
import { setPlayerCount, setOnlineCount } from './players';

// eslint-disable-next-line import/prefer-default-export
export const setupSockets = ({ server }, db) => {
  const io = new Server(server);
  const core = { io, db };

  watchForVersionUpdate(core);
  watchForUsersUpdate(core);
  watchForGamesUpdate(core);

  io.on('connection', (socket) => {
    const coreConnection = { ...core, socket, ...socket.handshake.query };
    const on = setupOn(coreConnection);

    on('saveGame', saveGame);
    on('userGames', setUserGames);
    on('stats', setStats);
    on('leaderboards', setLeaderboards);
    on('disconnect', disconnect);

    initNewGame(coreConnection);
    setUser(coreConnection);
    setPlayerCount(coreConnection);
    setGlobalPlayed(coreConnection);
    setUserPlayed(coreConnection);
    setOnlineCount(coreConnection);

    console.log('Client connected.', coreConnection.uid);
  });
};
