import { getAllGames, updateGlobalStats, updatePlayerStats } from '@/db/stats';
import { getUsers } from '@/db/user';
import { calculateStats } from '@/services/stats';
import { setupDB } from '../setup';

const updateBulkUsers = async (db) => {
  const [games, users] = await Promise.all([getAllGames(db), getUsers(db)]);

  const userStats = users.map(({ uid }) => {
    const userGames = games.filter(({ uid: uuid }) => uuid === uid);

    const stats = calculateStats(userGames);

    return { uid, ...stats };
  });

  const bulk = db.collection('userStats').initializeUnorderedBulkOp();

  userStats.forEach((stat) => {
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
    await Promise.all([
      updateGlobalStats(db),
      updatePlayerStats(db),
      updateBulkUsers(db),
    ]);

    console.log('stats updated');
  } catch (error) {
    console.log({ error });
  }
};

main();
