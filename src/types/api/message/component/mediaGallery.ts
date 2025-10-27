import type { ComponentType } from '../../../../enums';
import type { Library } from '../../../conversion';
import type { APIMediaGalleryItem } from './mediaGalleryItem';

export type APIMediaGallery = {
  type: ComponentType.MEDIA_GALLERY;
  id?: number;
  items: APIMediaGalleryItem[];
};

export type MediaGallery = Library<APIMediaGallery>;
