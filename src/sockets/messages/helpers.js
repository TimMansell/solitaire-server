export const formatMessage = ([name, payload]) =>
  name ? JSON.stringify({ name, payload }) : '';

export const createMessage =
  (...functions) =>
  (payload) =>
  (query) =>
    functions.reduce(async (result, fn) => fn(await result), {
      ...payload,
      ...query,
    });
