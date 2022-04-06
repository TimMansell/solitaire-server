import { getPlayers } from '#@/db/players';

export const setPlayerCount = async ({ socket, db }) => {
  try {
    const players = await getPlayers(db);

    socket.emit('playerCount', players);
  } catch (error) {
    console.log({ error });
  }
};

export const setOnlineCount = ({ io }) =>
  io.emit('onlineCount', io.engine.clientsCount);
