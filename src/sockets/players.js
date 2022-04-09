import { getPlayers } from '#@/db/stats';

export const emitPlayerCount = async ({ socket, ...core }) => {
  try {
    const players = await getPlayers(core);

    socket.emit('playerCount', players);
  } catch (error) {
    console.log({ error });
  }
};

export const emitOnlineCount = ({ io }) =>
  io.emit('onlineCount', io.engine.clientsCount);
