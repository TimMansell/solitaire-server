import { newDeck, saveNewGame } from '@/db/game';
import { updateUserStats, updateGlobalStats } from '@/db/stats';

export const newGame = async ({ socket, db }, uid) => {
  const isMocked = process.env.NODE_ENV === 'test';

  try {
    const cards = await newDeck(db, uid, isMocked);

    socket.emit('newGame', cards);
  } catch (error) {
    console.log({ error });
  }
};

export const saveGame = async ({ socket, db }, { uid, game }) => {
  console.log({ game });

  await saveNewGame(db, uid, game);

  await Promise.all([updateUserStats(db, uid), updateGlobalStats(db)]);

  socket.emit('saveGame');
};
