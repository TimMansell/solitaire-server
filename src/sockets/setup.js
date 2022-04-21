export const setupQuery = (db, socket, io) => (fn, params) =>
  fn({ db, io, ...socket?.handshake?.query, ...params });

export const setupEmit = (socket) => (name, data) => socket.emit(name, data);

export const setupWatcher = (db, io) => (func, callback) =>
  func(db).on('change', (record) => callback({ io, db, record }));
