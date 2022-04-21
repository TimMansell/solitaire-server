import { createUser, getUser, getUserGames } from '#@/db/user';

export const emitCreateUser = async ({ emit, query }) => {
  try {
    const newUser = await query(createUser);

    emit('user', newUser);
  } catch (error) {
    console.log({ error });
  }
};

export const emitUser = async ({ emit, query }) => {
  try {
    const user = await query(getUser);

    if (user) emit('user', user);
  } catch (error) {
    console.log({ error });
  }
};

export const emitUserGames = async ({ emit, query, params }) => {
  try {
    const [games] = await query(getUserGames, params);

    emit('userGames', games);
  } catch (error) {
    console.log({ error });
  }
};
