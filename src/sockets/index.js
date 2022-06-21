import { WebSocketServer } from 'ws';
import { initV1Socket, initTestSocket, upgradeSocket } from './socket';

export const setupSockets = (name) => ({
  name,
  socket: new WebSocketServer({ noServer: true }),
});

export const initSockets = (server, socketServers) => {
  const sockets = socketServers.reduce(
    (accumulator, { name, socket }) => ({ ...accumulator, [name]: socket }),
    {}
  );

  initV1Socket(sockets);
  initTestSocket(sockets);

  server.on('upgrade', upgradeSocket(sockets));
};
