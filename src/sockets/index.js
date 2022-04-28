import { WebSocketServer } from 'ws';
import EventEmitter from 'eventemitter3';
import queryString from 'query-string';
import { setupEmitEvents } from './setup';

// eslint-disable-next-line import/prefer-default-export
export const setupSockets = ([express, queryDb]) => {
  const wss = new WebSocketServer({ server: express });

  // setupWatchEvents({ db, io });

  wss.on('connection', (ws, req) => {
    const [path, params] = req?.url?.split('?');
    const connectionParams = queryString.parse(params);

    const db = queryDb(connectionParams);
    const emitter = new EventEmitter();

    setupEmitEvents(emitter);

    emitter.on('emit', (name, payload) =>
      ws.send(JSON.stringify({ name, payload }))
    );

    ws.on('message', (data) => {
      const { name, payload } = JSON.parse(data);

      emitter.emit(name, db, payload);
    });

    ws.on('close', () => {
      console.log('Client Disconnected.');
    });

    ws.on('error', () => {
      console.log('Some Error occurred.');
    });

    emitter.emit('initGame', db);

    console.log('Client connected.');
  });
};
