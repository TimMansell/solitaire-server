import { getUserNewDeck } from '#db';

// eslint-disable-next-line import/prefer-default-export
export const newGame = async (params) => {
  try {
    const deck = await getUserNewDeck(params);

    return ['newGame', deck];
  } catch (error) {
    console.error({ error });

    return [];
  }
};
