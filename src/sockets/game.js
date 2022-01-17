import { newDeck, saveNewGame } from '@/db/game';
import { updateUserStats, updateGlobalStats } from '@/db/stats';

export const newGame = async ({ socket, db }, uid) => {
  try {
    const cards = await newDeck(db, uid);

    socket.emit('newGame', cards);
  } catch (error) {
    console.log({ error });
  }
};

export const saveGame = async ({ socket, io, db }, { uid, game }) => {
  await saveNewGame(db, uid, game);

  const [userStats, globalStats] = await Promise.all([
    updateUserStats(db, uid),
    updateGlobalStats(db),
  ]);

  socket.emit('gameSaved');
  socket.emit('setUserGamesPlayed', userStats.completed);
  io.emit('setGlobalGamesPlayed', globalStats.completed);
};
