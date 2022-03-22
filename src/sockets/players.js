import { getPlayers } from '#@/db/players';

export const setPlayerCount = async ({ io, db }) => {
  try {
    const players = await getPlayers(db);

    io.emit('playerCount', players);
  } catch (error) {
    console.log({ error });
  }
};

export const setOnlineCount = ({ io }) =>
  io.emit('onlineCount', io.engine.clientsCount);
