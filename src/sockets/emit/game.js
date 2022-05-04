import { getDeck, newDeck, saveGame } from '#db/game';

export const emitInitalGame = async ({ hasGameStarted, uid }) => {
  if (JSON.parse(hasGameStarted)) return;

  try {
    const deck = await getDeck({ uid });
    const { cards } = deck ?? (await newDeck({ uid }));

    return cards;
  } catch (error) {
    console.log({ error });
  }
};

export const emitSaveGame = async (payload) => {
  try {
    await saveGame(payload);

    const { cards } = await newDeck(payload);

    return cards;
  } catch (error) {
    console.log({ error });
  }
};
