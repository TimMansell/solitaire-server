import tzMock from 'timezone-mock';
import {
  mockHistoryApi,
  mockHistory,
  mockLeaderboardsTimesAPI,
  mockLeaderboardsTimes,
  mockLeaderboardsMovesAPI,
  mockLeaderboardsMoves,
  mockPlayers,
  mockStats,
} from '#@/services/solitaire/mockData';
import {
  formatLeaderboardGames,
  formatHistoryGames,
  formatStats,
} from '../index';

tzMock.register('UTC');

describe('Sockets Formatting', () => {
  it('should return formatted leaderboard games using times', async () => {
    const result = formatLeaderboardGames(
      mockLeaderboardsTimesAPI,
      mockPlayers,
      { showBest: 'time' }
    );

    expect(result).toEqual(mockLeaderboardsTimes);
  });

  it('should return formatted leaderboard games using moves', async () => {
    const result = formatLeaderboardGames(
      mockLeaderboardsMovesAPI,
      mockPlayers,
      { showBest: 'moves' }
    );

    expect(result).toEqual(mockLeaderboardsMoves);
  });

  it('should return formatted history games', async () => {
    const result = formatHistoryGames(mockHistoryApi, mockHistoryApi.length, 0);

    expect(result).toEqual(mockHistory);
  });

  it('should return formated stats', async () => {
    const result = formatStats(mockStats);

    expect(result).toStrictEqual([
      ['4', '2', '1', '1'],
      ['', '50.00%', '25.00%', '25.00%'],
    ]);
  });
});
