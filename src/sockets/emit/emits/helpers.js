export const setupEmit = (emitter) => (payload) =>
  emitter.emit('sendMessage', payload);

export const formatPayload = ([name, payload]) =>
  JSON.stringify({ name, payload });

export const createEmitter =
  (...fns) =>
  (params, message) =>
    fns.reduce(async (result, fn) => fn(await result), { ...params, message });
