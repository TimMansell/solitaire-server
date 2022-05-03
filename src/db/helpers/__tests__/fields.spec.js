import { getLeaderboardFields } from '../fields';

describe('DB Query Formatting', () => {
  describe('Leaderboards', () => {
    it('should return correct query', async () => {
      const { key } = getLeaderboardFields('moves');

      expect(key).toEqual('moves');
    });

    it('should return default query ', async () => {
      const { key } = getLeaderboardFields('invalidKey');

      expect(key).toEqual('moves');
    });
  });
});
