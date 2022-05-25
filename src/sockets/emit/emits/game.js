import { getDeckByUid, getUserNewDeck } from '#db';

export const initGame = async (params) => {
  try {
    const deck = await getDeckByUid(params);
    const { cards } = deck ?? (await getUserNewDeck(params));

    return ['newGame', cards];
  } catch (error) {
    console.log({ error });
  }
};

export const newGame = async (params) => {
  try {
    const { cards } = await getUserNewDeck(params);

    return ['newGame', cards];
  } catch (error) {
    console.log({ error });
  }
};
