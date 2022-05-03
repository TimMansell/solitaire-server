import { createUser, getUser, getUserGames } from '#query/db';

export const emitCreateUser = async (params) => {
  try {
    const newUser = await createUser(params);

    return newUser;
  } catch (error) {
    console.log({ error });
  }
};

export const emitUser = async (params) => {
  try {
    const user = await getUser(params);

    return user;
  } catch (error) {
    console.log({ error });
  }
};

export const emitUserGames = async (params) => {
  try {
    const games = await getUserGames(params);

    return games;
  } catch (error) {
    console.log({ error });
  }
};
