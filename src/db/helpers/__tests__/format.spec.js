import { formatNumber, formatPercent, formatDuration } from '../format';

describe('DB Format Helpers', () => {
  describe('Number', () => {
    it('should format large number correctly', () => {
      const result = formatNumber(1000);

      expect(result).toBe('1,000');
    });

    it('should format number correctly', () => {
      const result = formatNumber(10);

      expect(result).toBe('10');
    });
  });

  describe('Percent', () => {
    it('should format correct %', () => {
      const result = formatPercent(1 / 2);

      expect(result).toBe('50.00%');
    });

    it('should round to correct %', () => {
      const result = formatPercent(1 / 85);

      expect(result).toBe('1.18%');
    });
  });

  describe('Time', () => {
    it('should correctly convert time to use seconds', () => {
      const result = formatDuration('10');

      expect(result).toEqual('0:00:10');
    });

    it('should correctly convert time to use minutes:seconds', () => {
      const result = formatDuration('1000');

      expect(result).toEqual('0:16:40');
    });

    it('should correctly convert time to use hours:minutes:seconds', () => {
      const result = formatDuration('10000');

      expect(result).toEqual('2:46:40');
    });
  });
});
