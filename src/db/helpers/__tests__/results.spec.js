import { formatLeaderboards, formatGames, formatStats } from '../results';

describe('DB Result Formatting', () => {
  describe('Leaderboards', () => {
    it('should return formatted leaderboard game', async () => {
      const result = formatLeaderboards({
        rank: 1,
        name: 'test',
        date: '2021-04-29T12:25:47.907Z',
        time: 200,
        moves: 10,
        wonPercent: 0.33,
        won: 1234,
      });

      expect(result).toEqual({
        rank: 1,
        name: 'test',
        date: '2021-04-29T12:25:47.907Z',
        time: '0:03:20',
        moves: 10,
        wonPercent: '33.00%',
        won: '1,234',
      });
    });

    it('should only return required leaderboard fields', async () => {
      const result = formatLeaderboards({
        rank: 1,
        name: 'test',
        date: '2021-04-29T12:25:47.907Z',
        time: 200,
      });

      expect(result).toEqual({
        rank: 1,
        name: 'test',
        date: '2021-04-29T12:25:47.907Z',
        time: '0:03:20',
      });
    });
  });

  describe('History', () => {
    it('should return formatted historic game', async () => {
      const result = formatGames({
        played: 2000,
        rank: 10,
        date: '2021-04-29T12:25:47.907Z',
        outcome: 'Won',
        moves: 10,
        time: 200,
      });

      expect(result).toEqual({
        number: '1,990',
        date: '2021-04-29T12:25:47.907Z',
        time: '2021-04-29T12:25:47.907Z',
        outcome: 'Won',
        moves: 10,
        duration: '0:03:20',
      });
    });
  });

  describe('Stats', () => {
    it('should return formated stats', async () => {
      const result = formatStats({
        completed: 4,
        won: 2,
        lost: 1,
        quit: 1,
        wonPercent: 0.5,
        lostPercent: 0.25,
        quitPercent: 0.25,
      });

      expect(result).toStrictEqual([
        ['4', '2', '1', '1'],
        ['', '50.00%', '25.00%', '25.00%'],
      ]);
    });
  });
});
