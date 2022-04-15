import { Server } from 'socket.io';
import { initMongoEvents, initSocketEvents } from './setup';

// eslint-disable-next-line import/prefer-default-export
export const setupSockets = ([express, db]) => {
  const io = new Server(express);
  const server = { io, db };

  initMongoEvents(server);

  io.on('connection', (socket) => {
    const core = { ...server, socket, ...socket.handshake.query };

    initSocketEvents(core);

    console.log('Client connected.', core.uid);
  });
};
