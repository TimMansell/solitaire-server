import { getPlayers } from '#query/db';

export const emitPlayerCount = async () => {
  try {
    const players = await getPlayers();

    return players;
  } catch (error) {
    console.log({ error });
  }
};
