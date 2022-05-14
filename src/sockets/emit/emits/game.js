import { getDeckByUid, getUserNewDeck } from '#db';

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

export const newGame = async (payload) => {
  try {
    const { cards } = await getUserNewDeck(payload);

    return ['newGame', cards];
  } catch (error) {
    console.log({ error });
  }
};
