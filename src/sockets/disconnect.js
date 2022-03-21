import { getOnlineCount } from './players';

// eslint-disable-next-line import/prefer-default-export
export const disconnect = ({ io, socket, uid }) => {
  socket.removeAllListeners();

  getOnlineCount({ io });

  console.log('Client disconnected.', uid);
};
