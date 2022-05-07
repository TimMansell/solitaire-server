import { getDeckByUid, getUserNewDeck, saveGameByUid } from '#db/game';

export const initGame = async ({ hasGameStarted, uid }) => {
  if (hasGameStarted) return [];

  try {
    const deck = await getDeckByUid({ uid });
    const { cards } = deck ?? (await getUserNewDeck({ uid }));

    return ['newGame', cards];
  } catch (error) {
    console.log({ error });
  }
};

export const saveGame = async (payload) => {
  try {
    await saveGameByUid(payload);

    const { cards } = await getUserNewDeck(payload);

    return ['newGame', cards];
  } catch (error) {
    console.log({ error });
  }
};
