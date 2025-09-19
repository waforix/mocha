import type { Library } from '../../../conversion';
import type { APIUnfurledMediaItem } from './unfurledMediaItem';

export type APIMediaGalleryItem = {
  media: APIUnfurledMediaItem;
  description?: string;
  spoiler?: boolean;
};

export type MediaGalleryItem = Library<APIMediaGalleryItem>;
