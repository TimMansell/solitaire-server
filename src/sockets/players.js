import { getPlayers } from '#@/db/players';

export const getPlayerCount = async ({ io, db }) => {
  try {
    const players = await getPlayers(db);

    io.emit('playerCount', players);
  } catch (error) {
    console.log({ error });
  }
};

export const getOnlineCount = async ({ io }) =>
  io.emit('onlineCount', io.engine.clientsCount);
