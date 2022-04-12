import { Server } from 'socket.io';
import { initWatchEvents, initOnEvents, initEmitEvents } from './setup';

// eslint-disable-next-line import/prefer-default-export
export const setupSockets = ([express, db]) => {
  const io = new Server(express);
  const server = { io, db };

  initWatchEvents(server);

  io.on('connection', (socket) => {
    const core = { ...server, socket, ...socket.handshake.query };

    initOnEvents(core);
    initEmitEvents(core);

    console.log('Client connected.', core.uid);
  });
};
