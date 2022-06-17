import { getGamesByUid } from '#db';

// eslint-disable-next-line import/prefer-default-export
export const getUserGames = async (params) => {
  try {
    const games = await getGamesByUid(params);

    return ['userGames', games];
  } catch (error) {
    console.error({ error });

    return [];
  }
};
