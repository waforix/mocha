import { describe, it, expect } from 'vitest';
import {
  LibraryError,
  DatabaseError,
  DatabaseConnectionError,
  CacheError,
  ValidationError,
  NetworkError,
  GatewayConnectionError,
  RateLimitError,
  TimeoutError,
} from '../../../src/errors';

describe('Error Classes', () => {
  describe('LibraryError', () => {
    it('should create error with message and code', () => {
      const error = new LibraryError('Test error', 'TEST_ERROR');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.name).toBe('LibraryError');
    });

    it('should include context', () => {
      const context = { userId: '123', guildId: '456' };
      const error = new LibraryError('Test error', 'TEST_ERROR', context);
      expect(error.context).toEqual(context);
    });

    it('should include cause', () => {
      const cause = new Error('Original error');
      const error = new LibraryError('Test error', 'TEST_ERROR', {}, cause);
      expect(error.cause).toBe(cause);
    });

    it('should include timestamp', () => {
      const error = new LibraryError('Test error', 'TEST_ERROR');
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should serialize to JSON', () => {
      const error = new LibraryError('Test error', 'TEST_ERROR', { key: 'value' });
      const json = error.toJSON();
      expect(json.message).toBe('Test error');
      expect(json.code).toBe('TEST_ERROR');
      expect(json.context).toEqual({ key: 'value' });
      expect(json.timestamp).toBeDefined();
    });
  });

  describe('DatabaseError', () => {
    it('should create database error', () => {
      const error = new DatabaseError('DB error', { query: 'SELECT *' });
      expect(error.message).toBe('DB error');
      expect(error.code).toContain('DATABASE');
    });
  });

  describe('DatabaseConnectionError', () => {
    it('should create connection error', () => {
      const error = new DatabaseConnectionError('Connection failed');
      expect(error.message).toBe('Connection failed');
      expect(error.code).toContain('CONNECTION');
    });
  });

  describe('CacheError', () => {
    it('should create cache error', () => {
      const error = new CacheError('Cache error');
      expect(error.message).toBe('Cache error');
      expect(error.code).toContain('CACHE');
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with errors map', () => {
      const errors = { email: ['Invalid email'], age: ['Must be positive'] };
      const error = new ValidationError('Validation failed', errors);
      expect(error.message).toBe('Validation failed');
      expect(error.errors).toEqual(errors);
    });
  });

  describe('NetworkError', () => {
    it('should create network error with status code', () => {
      const error = new NetworkError('Network error', 500);
      expect(error.message).toBe('Network error');
      expect(error.statusCode).toBe(500);
    });
  });

  describe('GatewayConnectionError', () => {
    it('should create gateway connection error', () => {
      const error = new GatewayConnectionError('Gateway error');
      expect(error.message).toBe('Gateway error');
      expect(error.code).toContain('GATEWAY');
    });
  });

  describe('RateLimitError', () => {
    it('should create rate limit error with retry after', () => {
      const error = new RateLimitError('Rate limited', 60000);
      expect(error.message).toBe('Rate limited');
      expect(error.retryAfter).toBe(60000);
    });
  });

  describe('TimeoutError', () => {
    it('should create timeout error', () => {
      const error = new TimeoutError('Operation timed out', 5000);
      expect(error.message).toBe('Operation timed out');
    });
  });

  describe('error inheritance', () => {
    it('should be instanceof Error', () => {
      const error = new LibraryError('Test', 'TEST');
      expect(error).toBeInstanceOf(Error);
    });

    it('should be instanceof LibraryError', () => {
      const error = new DatabaseError('Test');
      expect(error).toBeInstanceOf(LibraryError);
    });
  });
});

