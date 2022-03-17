// eslint-disable-next-line import/prefer-default-export
export const setupOn =
  ({ socket, ...rest }) =>
  (socketName, socketFunction) =>
    socket.on(socketName, (payload, callback) =>
      socketFunction({ socket, ...rest }, payload, callback)
    );
