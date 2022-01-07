import { saveNewGame } from '@/db/game';
import { updateUserStats, updateGlobalStats } from '@/db/stats';
import { emitNewGame } from './emit/game';
import { emitCounts } from './emit/stats';

export const newGame = ({ socket, db }) => {
  socket.on('newGame', (uid) => {
    emitNewGame({ socket, db, uid });
  });
};

export const saveGame = ({ socket, db, io }) => {
  socket.on('saveGame', async ({ uid, game }) => {
    await saveNewGame(db, uid, game);

    await Promise.all([updateUserStats(db, uid), updateGlobalStats(db)]);

    emitCounts({ socket, io, db, uid });
  });
};
