import type { Library } from '../../conversion';
import type { APIActionRow } from './component/actionRow';
import type { APIButton } from './component/button';
import type { APIContainer } from './component/container';
import type { APIFile } from './component/file';
import type { APIMediaGallery } from './component/mediaGallery';
import type {
  APIChannelSelect,
  APIMentionableSelect,
  APIRoleSelect,
  APIUserSelect,
} from './component/mentionableSelect';
import type { APISeparator } from './component/separator';
import type { APIStringSelect } from './component/stringSelect';
import type { APITextDisplay } from './component/textDisplay';

export type APIMessageComponent =
  | APIActionRow<
      | APIButton
      | APIStringSelect
      | APIUserSelect
      | APIRoleSelect
      | APIMentionableSelect
      | APIChannelSelect
    >
  | APITextDisplay
  | APIMediaGallery
  | APIFile
  | APISeparator
  | APIContainer;

export type MessageComponent = Library<APIMessageComponent>;
