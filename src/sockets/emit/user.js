import { createUser, getUser, getUserGames } from '#query/db';

export const emitCreateUser = async ({ emit, queryDb }) => {
  try {
    const newUser = await queryDb(createUser);

    emit('user', newUser);
  } catch (error) {
    console.log({ error });
  }
};

export const emitUser = async ({ emit, queryDb }) => {
  try {
    const user = await queryDb(getUser);

    if (user) emit('user', user);
  } catch (error) {
    console.log({ error });
  }
};

export const emitUserGames = async ({ emit, queryDb }, params) => {
  try {
    const games = await queryDb(getUserGames, params);

    emit('userGames', games);
  } catch (error) {
    console.log({ error });
  }
};
