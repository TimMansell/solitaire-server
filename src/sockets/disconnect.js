import { setOnlineCount } from './players';

// eslint-disable-next-line import/prefer-default-export
export const disconnect = ({ socket, uid, ...core }) => {
  socket.removeAllListeners();

  setOnlineCount(core);

  console.log('Client disconnected.', uid);
};
