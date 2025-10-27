import type { Library } from '../../conversion';

export type APIActivityParty = {
  id?: string;
  size?: number[];
};

export type ActivityParty = Library<APIActivityParty>;
