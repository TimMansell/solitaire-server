import { checkGameState } from '#@/services/solitaire';
import { getDeck, saveNewGame } from '#@/db/game';
import { emitGame } from './emit/game';
import { emitOnlineCount } from './emit/players';

export const initGame = async ({ socket, timer, ...core }) => {
  if (timer > 0) return;

  try {
    const deck = await getDeck(core);

    emitGame({ socket, deck, ...core });
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

export const disconnectUser = ({ socket, uid, ...core }) => {
  socket.removeAllListeners();

  emitOnlineCount(core);

  console.log('Client disconnected.', uid);
};
