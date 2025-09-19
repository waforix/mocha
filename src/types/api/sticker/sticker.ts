import type { StickerFormat, StickerType } from '../../../enums';
import type { Library } from '../../conversion';
import type { APIUser } from '../user/user';

export type APISticker = {
  id: string;
  pack_id?: string;
  name: string;
  description: string | null;
  tags: string;
  type: StickerType;
  format_type: StickerFormat;
  available?: boolean;
  guild_id?: string;
  user?: APIUser;
  sort_value?: number;
};

export type Sticker = Library<APISticker>;
