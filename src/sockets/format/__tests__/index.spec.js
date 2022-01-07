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
import { formatLeaderboardGames, formatHistoryGames } from '../index';

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
});
