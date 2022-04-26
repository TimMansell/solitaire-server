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

export const setupCore = (db, io, socket) => {
  const queryIo = setupQuery({ io });
  const queryDb = setupQuery({ db, params: socket.handshake.query });
  const queryParams = setupQuery({ params: socket.handshake.query });
  const emit = setupEmit(socket);
  const globalEmit = setupEmit(io);

  return { queryParams, queryDb, queryIo, globalEmit, emit };
};
