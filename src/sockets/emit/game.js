import { checkGameStarted } from '#query/params';
import { getDeck, newDeck } from '#query/db';

export const emitInitalGame = async ({ emit, queryParams, queryDb }) => {
  const hasGameStarted = queryParams(checkGameStarted);

  if (hasGameStarted) return;

  try {
    const deck = await queryDb(getDeck);
    const { cards } = deck ?? (await queryDb(newDeck));

    emit('newGame', cards);
  } catch (error) {
    console.log({ error });
  }
};

export const emitNewGame = async ({ emit, queryDb }) => {
  try {
    const { cards } = await queryDb(newDeck);

    emit('newGame', cards);
  } catch (error) {
    console.log({ error });
  }
};
