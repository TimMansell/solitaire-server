// eslint-disable-next-line import/prefer-default-export
export const setupEmit =
  (emitter) =>
  ([name, payload]) =>
    emitter.emit('message', { name, payload });
