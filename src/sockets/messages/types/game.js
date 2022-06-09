import { getUserDeck, getUserNewDeck } from '#db';

export const initGame = async (params) => {
  try {
    const deck = await getUserDeck(params);
    const { cards } = deck || (await getUserNewDeck(params));

    return ['newGame', cards];
  } catch (error) {
    console.error({ error });

    return [];
  }
};

export const newGame = async (params) => {
  try {
    const { cards } = await getUserNewDeck(params);

    return ['newGame', cards];
  } catch (error) {
    console.error({ error });

    return [];
  }
};
