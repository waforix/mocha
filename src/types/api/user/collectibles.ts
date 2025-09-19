import type { Library } from '../../conversion';
import type { APINameplate } from './nameplate';

export type APICollectibles = {
  nameplate?: APINameplate;
};

export type Collectibles = Library<APICollectibles>;
