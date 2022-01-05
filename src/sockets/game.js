import { getAllGames, getUsersGames, updateStats } from '@/db/stats';
import { calculateStats } from '@/services/stats';

import { emitNewGame, emitSavedGame } from './emit/game';
import { emitCounts } from './emit/stats';
import { emitSetUser } from './emit/user';

export const newGame = ({ socket, db }) => {
  socket.on('newGame', (uid) => {
    emitNewGame({ socket, db, uid });
  });
};

export const saveGame = ({ socket, db, io }) => {
  socket.on('saveGame', async ({ uid, game, gameOutcome }) => {
    await Promise.all([
      emitSavedGame({ socket, db, uid, game, gameOutcome }),
      emitSetUser({ socket, db, uid, create: true }),
    ]);

    const [allGames, usersGames] = await Promise.all([
      getAllGames(db),
      getUsersGames(db, uid),
    ]);

    const globalStats = calculateStats(allGames);
    const userStats = calculateStats(usersGames);

    await Promise.all([
      updateStats(db, 'globalStats', globalStats),
      updateStats(db, 'userStats', { uid, ...userStats }),
    ]);

    emitCounts({ socket, io, db, uid });
  });
};
