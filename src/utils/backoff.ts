export const calculateBackoff = (attempt: number, maxDelay = 30000): number =>
  Math.min(1000 * 2 ** attempt, maxDelay);
