import { mockHistoryApi } from '@/mockData';
import { calculateStats } from '../index';
import { formatStats } from '@/sockets/format';

describe('Stats service', () => {
  it('should return calculated stats', async () => {
    const result = calculateStats(mockHistoryApi);

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

  it('should return formated stats', async () => {
    const stats = calculateStats(mockHistoryApi);
    const result = formatStats(stats);

    expect(result).toStrictEqual([
      ['4', '2', '1', '1'],
      ['', '50.00%', '25.00%', '25.00%'],
    ]);
  });
});
