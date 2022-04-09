import { newDeck } from '#@/db/game';

// eslint-disable-next-line import/prefer-default-export
export const emitGame = async ({ socket, deck, ...core }) => {
  try {
    const useDeck = deck ?? newDeck(core);
    const { cards } = await useDeck;

    socket.emit('newGame', cards);
  } catch (error) {
    console.log({ error });
  }
};
