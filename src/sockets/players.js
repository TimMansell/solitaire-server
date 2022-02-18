import { getPlayers } from '#@/db/players';

export const getPlayerCount = async ({ io, db }) => {
  try {
    const players = await getPlayers(db);

    io.emit('setPlayerCount', players);
  } catch (error) {
    console.log({ error });
  }
};

export const getOnlinePlayerCount = async ({ io }) =>
  io.emit('setOnlinePlayerCount', io.engine.clientsCount);
