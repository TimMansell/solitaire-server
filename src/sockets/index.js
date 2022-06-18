import { WebSocketServer } from 'ws';
import {
  createGlobalSend,
  createSend,
  getParams,
  checkIsUser,
  getMessage,
  updateGlobalPlayed,
  updateOnlineCount,
  updatePlayerCount,
  updateUserPlayed,
  checkVersion,
} from './socket';
import { emitter } from '../eventEmitter';

export const setupSockets = (server, { path }) =>
  new WebSocketServer({ server, path });

export const initSockets = (sockets) => {
  const sendAllMessage = createGlobalSend(sockets);

  emitter.on('newGame', () => sendAllMessage(updateGlobalPlayed));
  emitter.on('newUser', () => sendAllMessage(updatePlayerCount));
  emitter.on('updateOnline', () => sendAllMessage(updateOnlineCount(sockets)));

  sockets.on('connection', async (ws, req) => {
    const params = getParams(req);
    const sendMessage = createSend(ws, params);

    const newGame = (uid) => {
      const isUser = checkIsUser(uid, params);

      if (!isUser) return;

      sendMessage(updateUserPlayed);
    };

    const newVersion = (appVersion) => sendMessage(checkVersion(appVersion));

    emitter.on('newGame', newGame);
    emitter.on('newVersion', newVersion);

    ws.on('message', (message) => {
      const responseMessage = getMessage(message);

      if (!responseMessage) return;

      sendMessage(responseMessage);
    });

    ws.on('close', () => {
      emitter.emit('updateOnline');

      emitter.removeListener('newGame', newGame);
      emitter.removeListener('newVersion', newVersion);

      console.log('Client Disconnected.');
    });

    ws.on('error', () => {
      console.log('Some Error occurred.');
    });

    emitter.emit('updateOnline');

    console.log('Client connected.');
  });
};
