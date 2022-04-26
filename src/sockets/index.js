import { Server } from 'socket.io';
import {
  setupWatchEvents,
  setupCore,
  setupOnEvents,
  setupEmitEvents,
} from './setup';
import { getUser } from '#query/db';

// eslint-disable-next-line import/prefer-default-export
export const setupSockets = ([express, db]) => {
  const io = new Server(express);

  setupWatchEvents(db, io);

  io.on('connection', async (socket) => {
    const core = setupCore(db, io, socket);

    setupOnEvents(core);
    setupEmitEvents(core);

    socket.on('disconnect', () => socket.removeAllListeners());

    socket.user = await core.queryDb(getUser);

    console.log('Client connected.');
  });
};
