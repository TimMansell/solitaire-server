import { WebSocketServer } from 'ws';
import { initV1Socket, initTestSocket, upgradeSocket } from './socket';
import { isTest } from '../main';

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

  if (isTest) {
    initTestSocket(sockets);
  }

  server.on('upgrade', upgradeSocket(sockets));
};
