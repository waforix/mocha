import type { Library } from '../../conversion';
import type { APIPollAnswerCount } from './pollAnswerCount';

export type APIPollResults = {
  is_finalized: boolean;
  answer_counts: APIPollAnswerCount[];
};

export type PollResults = Library<APIPollResults>;
