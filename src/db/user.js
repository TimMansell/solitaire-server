export const updateUser = async (db, uid, name) => {
  await db
    .collection('users')
    .findOneAndUpdate({ uid }, { $set: { name } }, { upsert: true });

  return name;
};

export const getUserDetails = async (db, uid) => {
  const user = await db
    .collection('users')
    .findOne({ uid }, { projection: { _id: 0, name: 1 } });

  return user?.name;
};

export const getAllUsers = async (db) => {
  const users = await db
    .collection('users')
    .find({}, { projection: { uid: 1 } })
    .toArray();

  return users;
};

export const getUsers = async (db, uids) => {
  const users = await db
    .collection('users')
    .find({ uid: { $in: uids } }, { projection: { _id: 0, uid: 1, name: 1 } })
    .toArray();

  return users;
};

export const getUserGames = async (db, uid, offset, limit) => {
  const findGames = await db
    .collection('games')
    .find(
      { uid },
      { projection: { date: 1, won: 1, lost: 1, time: 1, moves: 1 } }
    )
    .skip(offset)
    .limit(limit)
    .sort({ date: -1 })
    .toArray();

  const findGamesPlayed = db
    .collection('games')
    .find({ uid }, { projection: { date: 1 } })
    .count();

  const [games, gamesPlayed] = await Promise.all([findGames, findGamesPlayed]);

  return [games, gamesPlayed];
};
