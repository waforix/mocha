export const calculateBackoff = (attempt, maxDelay = 30000) => Math.min(1000 * 2 ** attempt, maxDelay);
