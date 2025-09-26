import type { Library } from '../../conversion';

export type APIActivityEmoji = {
  name: string;
  id?: string;
  animated?: boolean;
};

export type ActivityEmoji = Library<APIActivityEmoji>;
