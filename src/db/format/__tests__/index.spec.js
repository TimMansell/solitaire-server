import { mockHistoryApi } from '@/mockData';
import { calculateGameResults, calculateStats } from '../index';

describe('Stats service', () => {
  it('should return calculated stats', async () => {
    const games = calculateGameResults(mockHistoryApi);
    const result = calculateStats(games);

    expect(result).toStrictEqual({
      completed: 4,
      lost: 1,
      lostPercent: 0.25,
      quit: 1,
      quitPercent: 0.25,
      won: 2,
      wonPercent: 0.5,
    });
  });

  it('should return game counts', async () => {
    const result = calculateGameResults(mockHistoryApi);

    expect(result).toStrictEqual({
      completed: 4,
      lost: 1,
      quit: 1,
      won: 2,
    });
  });
});
