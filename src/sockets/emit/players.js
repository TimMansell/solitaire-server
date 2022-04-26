import { getPlayers } from '#query/db';
import { getOnlinePlayers } from '#query/io';

export const emitPlayerCount = async ({ emit, queryDb }) => {
  try {
    const players = await queryDb(getPlayers);

    emit('playerCount', players);
  } catch (error) {
    console.log({ error });
  }
};

export const emitOnlineCount = ({ emit, queryIo }) => {
  const onlinePlayers = queryIo(getOnlinePlayers);

  emit('onlineCount', onlinePlayers);
};
