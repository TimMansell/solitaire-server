import { checkGameStarted, getDeck, newDeck } from '#@/queries/game';

export const emitInitalGame = async ({ emit, query }) => {
  const hasGameStarted = query(checkGameStarted);

  if (hasGameStarted) return;

  try {
    const deck = await query(getDeck);
    const { cards } = deck ?? (await query(newDeck));

    emit('newGame', cards);
  } catch (error) {
    console.log({ error });
  }
};

export const emitNewGame = async ({ emit, query }) => {
  try {
    const { cards } = await query(newDeck);

    emit('newGame', cards);
  } catch (error) {
    console.log({ error });
  }
};
