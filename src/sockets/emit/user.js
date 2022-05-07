import { createNewUser, getUserByUid, getGamesByUid } from '#db/user';

export const createUser = async (params) => {
  try {
    const user = await createNewUser(params);

    return ['user', user];
  } catch (error) {
    console.log({ error });
  }
};

export const getUserDetails = async (params) => {
  try {
    const user = await getUserByUid(params);

    return ['user', user];
  } catch (error) {
    console.log({ error });
  }
};

export const getUserGames = async (params) => {
  try {
    const games = await getGamesByUid(params);

    return ['userGames', games];
  } catch (error) {
    console.log({ error });
  }
};
