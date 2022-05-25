export const formatMessage = ([name, payload]) =>
  name ? JSON.stringify({ name, payload }) : '';

export const createMessage =
  (...fns) =>
  (payload) =>
  (query) =>
    fns.reduce(async (result, fn) => fn(await result), {
      ...payload,
      ...query,
    });
