export const formatPayload = ([name, payload]) =>
  name ? JSON.stringify({ name, payload }) : '';

export const createEmitter =
  (...fns) =>
  (payload) =>
  (query) =>
    fns.reduce(async (result, fn) => fn(await result), {
      ...payload,
      ...query,
    });
