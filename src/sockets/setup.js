export const setupQuery =
  ({ db, io, params }) =>
  (fn, queryParams) =>
    fn({
      ...(db && { db }),
      ...(io && { io }),
      ...params,
      ...queryParams,
    });

export const setupEmit = (socket) => (name, data) => socket.emit(name, data);

export const setupWatcher = (db, io) => (func, callback) =>
  func(db).on('change', (record) => callback({ io, db, record }));
