import { newDeck, saveNewGame } from '#@/db/game';
import { updateUserStats, getGlobalStats } from '#@/db/stats';

export const newGame = async ({ db }, uid, callback) => {
  try {
    const cards = await newDeck(db, uid);

    callback(cards);
  } catch (error) {
    console.log({ error });
  }
};

export const saveGame = async ({ socket, io, db }, { uid, game }, callback) => {
  await saveNewGame(db, uid, game);

  const [userStats, globalStats] = await Promise.all([
    updateUserStats(db, uid),
    getGlobalStats(db),
  ]);

  socket.emit('setUserGamesPlayed', userStats.games.completed);
  io.emit('setGlobalGamesPlayed', globalStats.games.completed);

  callback();
};
