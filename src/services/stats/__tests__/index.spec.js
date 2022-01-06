import tzMock from 'timezone-mock';
import {
  mockHistoryApi,
  mockHistory,
  mockLeaderboardsTimesAPI,
  mockLeaderboardsTimes,
  mockLeaderboardsMovesAPI,
  mockLeaderboardsMoves,
  mockPlayers,
} from '@/mockData';
import {
  getLeaderboadSortBy,
  formatLeaderboardGames,
  formatHistoryGames,
  calculateStats,
  formatStats,
} from '../index';

tzMock.register('UTC');

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

  it('should return time from getLeaderboadSortBy', async () => {
    const result = getLeaderboadSortBy('times');

    expect(result).toEqual('time');
  });

  it('should return moves from getLeaderboadSortBy', async () => {
    const result = getLeaderboadSortBy('moves');

    expect(result).toEqual('moves');
  });

  it('should return formatted leaderboard games using times', async () => {
    const result = formatLeaderboardGames(
      mockLeaderboardsTimesAPI,
      mockPlayers,
      'time'
    );

    expect(result).toEqual(mockLeaderboardsTimes);
  });

  it('should return formatted leaderboard games using moves', async () => {
    const result = formatLeaderboardGames(
      mockLeaderboardsMovesAPI,
      mockPlayers,
      'moves'
    );

    expect(result).toEqual(mockLeaderboardsMoves);
  });

  it('should return formatted history games', async () => {
    const result = formatHistoryGames(mockHistoryApi, mockHistoryApi.length, 0);

    expect(result).toEqual(mockHistory);
  });
});
