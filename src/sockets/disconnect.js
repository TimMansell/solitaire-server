import { setOnlineCount } from './players';

// eslint-disable-next-line import/prefer-default-export
export const disconnect = ({ io, socket, uid }) => {
  socket.removeAllListeners();

  setOnlineCount({ io });

  console.log('Client disconnected.', uid);
};
