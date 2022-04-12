import { getDeck, newDeck } from '#@/db/game';

export const emitInitalGame = async ({ socket, timer, ...core }) => {
  if (timer > 0) return;

  try {
    const deck = await getDeck(core);
    const { cards } = deck ?? (await newDeck(core));

    socket.emit('newGame', cards);
  } catch (error) {
    console.log({ error });
  }
};

export const emitNewGame = async ({ socket, ...core }) => {
  try {
    const { cards } = await newDeck(core);

    socket.emit('newGame', cards);
  } catch (error) {
    console.log({ error });
  }
};
