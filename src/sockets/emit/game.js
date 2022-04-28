import { newDeck } from '#query/db';

export const emitInitalGame = (emitter) => {
  emitter.on('initGame', async (db) => {
    // const hasGameStarted = queryParams(checkGameStarted);

    // if (hasGameStarted) return;

    try {
      const deck = await db.getDeck();
      const { cards } = deck ?? (await db.newDeck());

      emitter.emit('emit', 'newGame', cards);
    } catch (error) {
      console.log({ error });
    }
  });
};

export const emitNewGame = async ({ emit, queryDb }) => {
  try {
    const { cards } = await queryDb(newDeck);

    emit('newGame', cards);
  } catch (error) {
    console.log({ error });
  }
};
