// eslint-disable-next-line import/prefer-default-export
export const setupOn =
  ({ socket, ...rest }) =>
  (socketName, callback) =>
    socket.on(socketName, (vars) => callback({ socket, ...rest }, vars));
