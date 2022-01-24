import { getOnlinePlayerCount } from './players';

// eslint-disable-next-line import/prefer-default-export
export const disconnect = ({ io, socket }) => {
  socket.removeAllListeners();

  getOnlinePlayerCount({ io });

  console.log('Client disconnected.', socket.id);
};
