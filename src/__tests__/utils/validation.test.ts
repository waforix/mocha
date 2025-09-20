import { describe, expect, it } from 'bun:test';
import {
  isValidGuildId,
  isValidSnowflake,
  isValidUserId,
  validateGuildId,
  validateLimit,
  validateTimeRange,
  validateUserId,
} from '../../utils/validation';

describe('Validation Utils', () => {
  describe('isValidSnowflake', () => {
    it('validates correct snowflake IDs', () => {
      expect(isValidSnowflake('123456789012345678')).toBe(true);
      expect(isValidSnowflake('1234567890123456789')).toBe(true);
    });

    it('rejects invalid snowflake IDs', () => {
      expect(isValidSnowflake('12345')).toBe(false);
      expect(isValidSnowflake('12345678901234567890')).toBe(false);
      expect(isValidSnowflake('abc123456789012345')).toBe(false);
      expect(isValidSnowflake('')).toBe(false);
      expect(isValidSnowflake(null)).toBe(false);
      expect(isValidSnowflake(undefined)).toBe(false);
    });
  });

  describe('isValidGuildId', () => {
    it('validates guild IDs', () => {
      expect(isValidGuildId('123456789012345678')).toBe(true);
      expect(isValidGuildId('invalid')).toBe(false);
    });
  });

  describe('isValidUserId', () => {
    it('validates user IDs', () => {
      expect(isValidUserId('123456789012345678')).toBe(true);
      expect(isValidUserId('invalid')).toBe(false);
    });
  });

  describe('validateGuildId', () => {
    it('passes valid guild IDs', () => {
      expect(() => validateGuildId('123456789012345678')).not.toThrow();
    });

    it('throws for invalid guild IDs', () => {
      expect(() => validateGuildId('invalid')).toThrow(
        'Guild ID must be a valid Discord snowflake ID'
      );
      expect(() => validateGuildId('')).toThrow('Guild ID must be a valid Discord snowflake ID');
    });
  });

  describe('validateUserId', () => {
    it('passes valid user IDs', () => {
      expect(() => validateUserId('123456789012345678')).not.toThrow();
    });

    it('throws for invalid user IDs', () => {
      expect(() => validateUserId('invalid')).toThrow(
        'User ID must be a valid Discord snowflake ID'
      );
    });
  });

  describe('validateLimit', () => {
    it('passes valid limits', () => {
      expect(() => validateLimit(1)).not.toThrow();
      expect(() => validateLimit(50)).not.toThrow();
      expect(() => validateLimit(100)).not.toThrow();
    });

    it('throws for invalid limits', () => {
      expect(() => validateLimit(0)).toThrow('Limit must be an integer between 1 and 100');
      expect(() => validateLimit(101)).toThrow('Limit must be an integer between 1 and 100');
      expect(() => validateLimit(1.5)).toThrow('Limit must be an integer between 1 and 100');
      expect(() => validateLimit(-1)).toThrow('Limit must be an integer between 1 and 100');
    });

    it('respects custom max limit', () => {
      expect(() => validateLimit(50, 25)).toThrow('Limit must be an integer between 1 and 25');
      expect(() => validateLimit(25, 25)).not.toThrow();
    });
  });

  describe('validateTimeRange', () => {
    it('passes valid time ranges', () => {
      const start = new Date('2023-01-01');
      const end = new Date('2023-01-02');
      expect(() => validateTimeRange(start, end)).not.toThrow();
      expect(() => validateTimeRange(undefined, end)).not.toThrow();
      expect(() => validateTimeRange(start, undefined)).not.toThrow();
    });

    it('throws for invalid time ranges', () => {
      const start = new Date('2023-01-02');
      const end = new Date('2023-01-01');
      expect(() => validateTimeRange(start, end)).toThrow('Start time must be before end time');
    });

    it('throws for invalid date objects', () => {
      // biome-ignore lint/suspicious/noExplicitAny: Testing invalid input type
      expect(() => validateTimeRange('invalid' as any, undefined)).toThrow(
        'Start time must be a Date object'
      );
      // biome-ignore lint/suspicious/noExplicitAny: Testing invalid input type
      expect(() => validateTimeRange(undefined, 'invalid' as any)).toThrow(
        'End time must be a Date object'
      );
    });
  });
});
