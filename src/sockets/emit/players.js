import { getPlayers } from '#db/stats';

// eslint-disable-next-line import/prefer-default-export
export const emitPlayerCount = async () => {
  try {
    const players = await getPlayers();

    return players;
  } catch (error) {
    console.log({ error });
  }
};
