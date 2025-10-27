import type { StickerFormat } from '../../../enums';
import type { Library } from '../../conversion';

export type APIStickerItem = {
  id: string;
  name: string;
  format_type: StickerFormat;
};

export type StickerItem = Library<APIStickerItem>;
