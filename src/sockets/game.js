import { checkGameState } from '#@/services/solitaire';
import { getDeck, newDeck, saveNewGame } from '#@/db/game';

export const initNewGame = async ({ socket, timer, ...core }) => {
  if (timer > 0) return;

  try {
    const savedDeck = await getDeck(core);
    const useDeck = savedDeck || newDeck(core);
    const { cards } = await useDeck;

    socket.emit('newGame', cards);
  } catch (error) {
    console.log({ error });
  }
};

export const newGame = async ({ socket, ...core }) => {
  try {
    const { cards } = await newDeck(core);

    socket.emit('newGame', cards);
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
