import { createUser, getGamesByUid } from '#db';

export const initUser = async (params) => {
  try {
    const user = await createUser(params);

    return ['user', user];
  } catch (error) {
    console.error({ error });

    return [];
  }
};

export const getUserGames = async (params) => {
  try {
    const games = await getGamesByUid(params);

    return ['userGames', games];
  } catch (error) {
    console.error({ error });

    return [];
  }
};
