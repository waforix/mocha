import { BACKOFF } from '../lib/constants';

export const calculateBackoff = (attempt: number, maxDelay = BACKOFF.MAX_DELAY): number =>
  Math.min(BACKOFF.BASE_DELAY * BACKOFF.MULTIPLIER ** attempt, maxDelay);
