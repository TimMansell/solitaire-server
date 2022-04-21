import { getPlayers, getOnlinePlayers } from '#@/db/stats';

export const emitPlayerCount = async ({ emit, query }) => {
  try {
    const players = await query(getPlayers);

    emit('playerCount', players);
  } catch (error) {
    console.log({ error });
  }
};

export const emitOnlineCount = ({ emit, query }) => {
  const onlinePlayers = query(getOnlinePlayers);

  emit('onlineCount', onlinePlayers);
};
