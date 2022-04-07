// eslint-disable-next-line import/prefer-default-export
export const setupOn =
  ({ socket, ...core }) =>
  (socketName, callback) =>
    socket.on(socketName, (vars) => callback({ socket, ...core }, vars));
