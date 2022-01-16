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
  formatLeaderboardGames,
  formatHistoryGames,
  formatStats,
} from '../index';
import { calculateGameResults, calculateStats } from '@/db/format';

tzMock.register('UTC');

describe('Stats service', () => {
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

  it('should return formated stats', async () => {
    const games = calculateGameResults(mockHistoryApi);
    const stats = calculateStats(games);
    const result = formatStats(stats);

    expect(result).toStrictEqual([
      ['4', '2', '1', '1'],
      ['', '50.00%', '25.00%', '25.00%'],
    ]);
  });
});
