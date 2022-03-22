import { Server } from 'socket.io';

import { setupOn } from './setup';
import { disconnect } from './disconnect';
import { checkVersion } from './version';
import { newGame, saveGame } from './game';
import { createUser, setUser, setUserGames } from './user';
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

  io.on('connection', async (socket) => {
    const { uid } = socket.handshake.query;
    const core = { socket, io, db, uid };

    const on = setupOn(core);

    on('newGame', newGame);
    on('saveGame', saveGame);
    on('createUser', createUser);
    on('userGames', setUserGames);
    on('stats', setStats);
    on('leaderboards', setLeaderboards);
    on('disconnect', disconnect);

    checkVersion(core);
    setUser(core);
    setPlayerCount(core);
    setGlobalPlayed(core);
    setUserPlayed(core);
    setOnlineCount(core);

    console.log('Client connected.', uid);
  });
};
