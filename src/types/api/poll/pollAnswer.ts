import type { Library } from '../../conversion';
import type { APIPollMedia } from './pollMedia';

export type APIPollAnswer = {
  answer_id: number;
  poll_media: APIPollMedia;
};

export type PollAnswer = Library<APIPollAnswer>;
