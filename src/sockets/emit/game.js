import { getDeck, newDeck, saveGame } from '#query/db';

export const emitInitalGame = async (payload) => {
  // const hasGameStarted = queryParams(checkGameStarted);

  // if (hasGameStarted) return;

  try {
    const deck = await getDeck(payload);
    const { cards } = deck ?? (await newDeck(payload));

    return cards;
  } catch (error) {
    console.log({ error });
  }
};

export const emitNewGame = async (payload) => {
  try {
    const { cards } = await newDeck(payload);

    return cards;
  } catch (error) {
    console.log({ error });
  }
};
