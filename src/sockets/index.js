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

  watchForVersionUpdate({ io, db });
  watchForUsersUpdate({ io, db });
  watchForGamesUpdate({ io, db });

  io.on('connection', (socket) => {
    const { query } = socket.handshake;
    const core = { socket, io, db, ...query };

    const on = setupOn(core, query);

    on('saveGame', saveGame);
    on('userGames', setUserGames);
    on('stats', setStats);
    on('leaderboards', setLeaderboards);
    on('disconnect', disconnect);

    initNewGame(core);
    setUser(core);
    setPlayerCount(core);
    setGlobalPlayed(core);
    setUserPlayed(core);
    setOnlineCount(core);

    console.log('Client connected.', query.uid);
  });
};
