import { getDeck, newDeck, saveNewGame } from '#@/db/game';
import { updateUserStats, getGlobalStats } from '#@/db/stats';

export const initNewGame = async ({ socket, db, uid, timer }) => {
  if (timer > 0) return;

  try {
    const savedDeck = await getDeck(db, uid);
    const useDeck = savedDeck || newDeck(db, uid);
    const deck = await useDeck;

    socket.emit('newGame', deck);
  } catch (error) {
    console.log({ error });
  }
};

export const saveGame = async ({ io, socket, db, uid }, game) => {
  try {
    await saveNewGame(db, uid, game);

    const [userStats, globalStats, deck] = await Promise.all([
      updateUserStats(db, uid),
      getGlobalStats(db),
      newDeck(db, uid),
    ]);

    socket.emit('newGame', deck);
    socket.emit('userPlayed', userStats.games.completed);
    io.emit('globalPlayed', globalStats.games.completed);
  } catch (error) {
    console.log({ error });
  }
};
