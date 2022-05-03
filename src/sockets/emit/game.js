import { getDeck, newDeck } from '#db/game';

export const emitInitalGame = async ({ hasGameStarted, uid }) => {
  if (hasGameStarted) return;

  try {
    const deck = await getDeck({ uid });
    const { cards } = deck ?? (await newDeck({ uid }));

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
