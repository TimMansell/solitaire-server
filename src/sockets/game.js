import { checkGameState } from '#@/services/solitaire';
import { getDeck, newDeck, saveNewGame } from '#@/db/game';

export const emitNewGame = async ({ socket, deck, ...core }) => {
  try {
    const useDeck = deck ?? newDeck(core);
    const { cards } = await useDeck;

    socket.emit('newGame', cards);
  } catch (error) {
    console.log({ error });
  }
};

export const initGame = async ({ socket, timer, ...core }) => {
  if (timer > 0) return;

  try {
    const deck = await getDeck(core);

    emitNewGame({ socket, deck, ...core });
  } catch (error) {
    console.log({ error });
  }
};

export const saveGame = async (core, game) => {
  try {
    const { cards } = await getDeck(core);
    const gameState = checkGameState(game, cards);

    saveNewGame(core, { ...game, ...gameState });
  } catch (error) {
    console.log({ error });
  }
};
