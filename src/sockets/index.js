import { WebSocketServer } from 'ws';
import {
  getUid,
  createGlobalSend,
  createSend,
  getResponseMessage,
  updateGlobalPlayed,
  updateOnlineCount,
  updatePlayerCount,
  updateUserPlayed,
  checkUserVersion,
} from './socket';
import { emitter } from '../eventEmitter';

export const setupSockets = (server) => new WebSocketServer({ server });

export const initSockets = (sockets) => {
  const sendAllMessage = createGlobalSend(sockets);

  emitter.on('newGame', () => sendAllMessage(updateGlobalPlayed));
  emitter.on('newUser', () => sendAllMessage(updatePlayerCount));
  emitter.on('onlineCount', () => sendAllMessage(updateOnlineCount(sockets)));

  sockets.on('connection', async (ws, req) => {
    const sendMessage = createSend(ws, req);

    const newGame = (gameUid) => {
      const uid = getUid(req);

      if (uid !== gameUid) return;

      sendMessage(updateUserPlayed);
    };

    const newVersion = (appVersion) =>
      sendMessage(checkUserVersion(appVersion));

    emitter.on('newGame', newGame);
    emitter.on('newVersion', newVersion);

    ws.on('message', (message) => {
      const responseMessage = getResponseMessage(message);

      if (!responseMessage) return;

      sendMessage(responseMessage);
    });

    ws.on('close', () => {
      emitter.emit('onlineCount');

      emitter.removeListener('newGame', newGame);
      emitter.removeListener('newVersion', newVersion);

      console.log('Client Disconnected.');
    });

    ws.on('error', () => {
      console.log('Some Error occurred.');
    });

    emitter.emit('onlineCount');

    console.log('Client connected.');
  });
};
