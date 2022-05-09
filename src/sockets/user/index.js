import { newEmitter } from '../emit';
import { watchDB } from '#watchers';

const runEmitEvents = (emits, params) =>
  emits.forEach((runEmit) => runEmit(params));

const checkMessageNameExists = (messageName, messages) =>
  messages.find(({ name }) => `${messageName}Msg` === name);

// eslint-disable-next-line import/prefer-default-export
export const newUser = (params) => {
  const { on, init, messages, emitUserPlayed, emitCheckVersion } = newEmitter();
  const db = watchDB();

  db.on('newGame', (uid) => {
    if (params.uid !== uid) return;

    emitUserPlayed(params);
    // Todo createUser()
  });

  db.on('newVersion', (appVersion) =>
    emitCheckVersion({ ...params, appVersion })
  );

  runEmitEvents(init, params);

  return {
    on,
    sendMessage: (message) => {
      const { name, payload } = JSON.parse(message);

      const runEmit = checkMessageNameExists(name, messages);

      if (!runEmit) return console.error('Invalid message name');

      runEmit({ ...params, ...payload });
    },
  };
};
