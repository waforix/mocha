import type { Library } from '../../conversion';

export type APIActivityMetadata = {
  button_urls?: string[];
  artist_ids?: string[];
  album_id?: string[];
  context_url?: string;
  type?: string;
};

export type ActivityMetadata = Library<APIActivityMetadata>;
