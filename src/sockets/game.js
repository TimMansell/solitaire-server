import { getDeck, newDeck, saveNewGame } from '#@/db/game';

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

export const saveGame = async ({ socket, db, uid }, game) => {
  try {
    await saveNewGame(db, uid, game);

    const deck = await newDeck(db, uid);

    socket.emit('newGame', deck);
  } catch (error) {
    console.log({ error });
  }
};
