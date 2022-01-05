import { setupDB } from '../setup';
import { getAllGames } from '@/db/stats';
import { getUsers } from '@/db/user';
import { calculateStats } from '@/services/stats';

const updateBulkStats = async (db, collection, stats) => {
  const bulk = db.collection(collection).initializeUnorderedBulkOp();

  stats.forEach((stat) => {
    const { uid } = stat;

    bulk
      .find({ uid })
      .upsert()
      .update({ $set: { ...stat } });
  });

  await bulk.execute();
};

const main = async () => {
  const db = await setupDB();

  try {
    const games = await getAllGames(db);

    const globalStats = calculateStats(games);

    const users = await getUsers(db);

    const userStats = users.map(({ uid }) => {
      const userGames = games.filter(({ uid: uid2 }) => uid2 === uid);

      const stats = calculateStats(userGames);

      return { uid, ...stats };
    });

    updateBulkStats(db, 'globalStats', [globalStats]);
    updateBulkStats(db, 'userStats', userStats);
  } catch (error) {
    console.log({ error });
  }
};

main();
