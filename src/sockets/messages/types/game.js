import { getUserNewDeck, getUserByUid } from '#db';

export const initGame = async (params) => {
  try {
    const { name, deck } = await getUserByUid(params);
    const { cards } = deck || (await getUserNewDeck(params));

    return ['initGame', { user: { name }, cards }];
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
