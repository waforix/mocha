import type { ComponentType } from '../../../../enums';
import type { Library } from '../../../conversion';
import type { APIUnfurledMediaItem } from './unfurledMediaItem';

export type APIThumbnail = {
  type?: ComponentType.THUMBNAIL;
  id?: number;
  media: APIUnfurledMediaItem;
  description?: string;
  spoiler?: boolean;
};

export type Thumbnail = Library<APIThumbnail>;
