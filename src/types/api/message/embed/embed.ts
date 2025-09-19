import type { EmbedType } from '../../../../enums';
import type { Library } from '../../../conversion';
import type { APIEmbedAuthor } from './embedAuthor';
import type { APIEmbedField } from './embedField';
import type { APIEmbedFooter } from './embedFooter';
import type { APIEmbedImage } from './embedImage';
import type { APIEmbedProvider } from './embedProvider';
import type { APIEmbedThumbnail } from './embedThumbnail';
import type { APIEmbedVideo } from './embedVideo';

export type APIEmbed = {
  title?: string;
  type?: EmbedType;
  description?: string;
  url?: string;
  timestamp?: Date;
  color?: number;
  footer?: APIEmbedFooter;
  image?: APIEmbedImage;
  thumbnail?: APIEmbedThumbnail;
  video?: APIEmbedVideo;
  provider?: APIEmbedProvider;
  author?: APIEmbedAuthor;
  fields?: APIEmbedField[];
};

export type Embed = Library<APIEmbed>;
