import { emitOnlineCount } from './players';

// eslint-disable-next-line import/prefer-default-export
export const disconnect = ({ socket, uid, ...core }) => {
  socket.removeAllListeners();

  emitOnlineCount(core);

  console.log('Client disconnected.', uid);
};
