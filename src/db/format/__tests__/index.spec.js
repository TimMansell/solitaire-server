import { mockStats } from '#@/services/solitaire/mockData';
import { calculateResults, calculatePercents } from '../index';

describe('DB Formatting', () => {
  it('should return calculated stats', async () => {
    const result = calculatePercents(mockStats.games);

    expect(result).toStrictEqual({
      lost: 0.25,
      quit: 0.25,
      won: 0.5,
    });
  });

  it('should return game counts', async () => {
    const result = calculateResults(mockStats.games);

    expect(result).toStrictEqual({
      completed: 4,
      lost: 1,
      quit: 1,
      won: 2,
    });
  });
});
