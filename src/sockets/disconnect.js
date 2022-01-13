// eslint-disable-next-line import/prefer-default-export
export const disconnect = ({ socket }) => {
  socket.removeAllListeners();

  console.log('Client disconnected.', socket.id);
};
