import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { Validator } from '../../../src/validation/validator';
import { InvalidInputError } from '../../../src/errors/validation';

describe('Validator', () => {
  const testSchema = z.object({
    name: z.string().min(1),
    age: z.number().int().positive(),
    email: z.string().email(),
  });

  describe('validate', () => {
    it('should validate correct data', () => {
      const data = { name: 'John', age: 30, email: 'john@example.com' };
      const result = Validator.validate(testSchema, data);
      expect(result).toEqual(data);
    });

    it('should throw InvalidInputError on validation failure', () => {
      const data = { name: '', age: -5, email: 'invalid' };
      expect(() => {
        Validator.validate(testSchema, data);
      }).toThrow(InvalidInputError);
    });

    it('should include context in error', () => {
      const data = { name: '', age: -5, email: 'invalid' };
      try {
        Validator.validate(testSchema, data, 'TestData');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidInputError);
        if (error instanceof InvalidInputError) {
          expect(error.context).toBeDefined();
        }
      }
    });

    it('should collect all validation errors', () => {
      const data = { name: '', age: -5, email: 'invalid' };
      try {
        Validator.validate(testSchema, data);
      } catch (error) {
        if (error instanceof InvalidInputError) {
          expect(Object.keys(error.errors).length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('safeParse', () => {
    it('should return success result for valid data', () => {
      const data = { name: 'John', age: 30, email: 'john@example.com' };
      const result = Validator.safeParse(testSchema, data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
      }
    });

    it('should return error result for invalid data', () => {
      const data = { name: '', age: -5, email: 'invalid' };
      const result = Validator.safeParse(testSchema, data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(InvalidInputError);
      }
    });

    it('should not throw on invalid data', () => {
      const data = { name: '', age: -5, email: 'invalid' };
      expect(() => {
        Validator.safeParse(testSchema, data);
      }).not.toThrow();
    });
  });

  describe('nested validation', () => {
    const nestedSchema = z.object({
      user: z.object({
        name: z.string(),
        profile: z.object({
          bio: z.string().optional(),
          age: z.number().positive(),
        }),
      }),
    });

    it('should validate nested objects', () => {
      const data = {
        user: {
          name: 'John',
          profile: { bio: 'Developer', age: 30 },
        },
      };
      const result = Validator.validate(nestedSchema, data);
      expect(result).toEqual(data);
    });

    it('should report nested validation errors', () => {
      const data = {
        user: {
          name: 'John',
          profile: { bio: 'Developer', age: -5 },
        },
      };
      try {
        Validator.validate(nestedSchema, data);
      } catch (error) {
        if (error instanceof InvalidInputError) {
          expect(Object.keys(error.errors).length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('array validation', () => {
    const arraySchema = z.object({
      items: z.array(z.string()),
    });

    it('should validate arrays', () => {
      const data = { items: ['a', 'b', 'c'] };
      const result = Validator.validate(arraySchema, data);
      expect(result).toEqual(data);
    });

    it('should reject invalid array items', () => {
      const data = { items: ['a', 123, 'c'] };
      expect(() => {
        Validator.validate(arraySchema, data);
      }).toThrow(InvalidInputError);
    });
  });
});

