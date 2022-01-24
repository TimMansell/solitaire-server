// eslint-disable-next-line import/prefer-default-export
export const getPlayers = async (db) =>
  db.collection('users').find({}, {}).count();
