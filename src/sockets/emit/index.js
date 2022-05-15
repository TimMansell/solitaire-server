import { runEmits, getEmit } from './run';
import { setupEmitter } from './emits';
import { dbEmitter } from '#watchers';

export const globalEmitter = () => {
  const db = dbEmitter();
  const { on, emitGlobalPlayed, emitPlayerCount, emitOnlineCount } =
    setupEmitter();

  db.on('newGame', emitGlobalPlayed);
  db.on('newUser', emitPlayerCount);

  return {
    on,
    updateOnlineCount: emitOnlineCount,
  };
};

export const connectionEmitter = (params) => {
  const db = dbEmitter();
  const {
    on,
    getOnConnectedEmits,
    getMessages,
    emitUserPlayed,
    emitCheckVersion,
  } = setupEmitter();

  const connectedEmits = getOnConnectedEmits();
  const messages = getMessages();

  db.on('newGame', (uid) => {
    if (params.uid !== uid) return;

    emitUserPlayed(params);
  });

  db.on('newVersion', (appVersion) =>
    emitCheckVersion({ ...params, appVersion })
  );

  const init = () => runEmits(connectedEmits, params);

  const runMessage = (message) => {
    const { name, payload } = JSON.parse(message);
    const emit = getEmit(name, messages);

    emit({ ...params, ...payload });
  };

  return {
    on,
    init,
    runMessage,
    // init: () => runEmits(connectedEmits, params),
    // message: (message) => runMessage(message, messages, params),
  };
};
