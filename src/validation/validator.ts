import { z } from 'zod';
import { InvalidInputError } from '../errors/validation';

/**
 * Validate input against a schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @param context - Additional context for error messages
 * @returns Validated data
 * @throws InvalidInputError if validation fails
 * @category Validation
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown, context?: string): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      for (const issue of error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      }
      throw new InvalidInputError(`Validation failed${context ? ` for ${context}` : ''}`, errors, {
        context,
      });
    }
    throw error;
  }
}

/**
 * Safely validate input, returning result or error
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result
 * @category Validation
 */
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: InvalidInputError } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      for (const issue of error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      }
      return {
        success: false,
        error: new InvalidInputError('Validation failed', errors),
      };
    }
    throw error;
  }
}
