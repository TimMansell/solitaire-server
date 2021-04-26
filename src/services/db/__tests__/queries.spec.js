import { getUserStats, getStatsCount, getGlobalStats } from '../queries';

jest.mock('../apollo');

describe('DB service queries', () => {
  it('getUserStats', async () => {
    const result = await getUserStats(1);

    expect(result).toEqual({
      error: false,
      response: { userStats: 1 },
    });
  });

  it('getStatsCount', async () => {
    const result = await getStatsCount(1);

    expect(result).toEqual({
      error: false,
      response: {
        userStats: 1,
        globalStats: 1,
      },
    });
  });

  it('getGlobalStats', async () => {
    const result = await getGlobalStats();

    expect(result).toEqual({
      error: false,
      response: { globalStats: 1 },
    });
  });
});
