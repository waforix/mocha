import type { MessageType } from '../../../enums';
import type { Library } from '../../conversion';
import type { APIApplication } from '../application/application';
import type { APIChannel } from '../channel/channel';
import type { APIThreadMember } from '../channel/threadMember';
import type { APIPoll } from '../poll/poll';
import type { APIRole } from '../role/role';
import type { APISticker } from '../sticker/sticker';
import type { APIStickerItem } from '../sticker/stickerItem';
import type { APIUser } from '../user/user';
import type { APIMessageActivity } from './messageActivity';
import type { APIMessageCall } from './messageCall';
import type { APIMessageComponent } from './messageComponent';
import type { APIMessageInteraction } from './messageInteraction';
import type { APIMessageInteractionMetadata } from './messageInteractionMetadata';
import type { APIMessageReference } from './messageReference';
import type { APIResolvedData } from './resolvedData';
import type { APIRoleSubscriptionData } from './roleSubscriptionData';

export type APIMessage = {
  id: string;
  channel_id: string;
  author: APIUser;
  content: string;
  timestamp: Date;
  edited_timestamp: Date | null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: APIUser[];
  mention_roles: APIRole[];
  mention_channels?: APIChannel[];
  attachments: null;
  embeds: null;
  reactions?: null;
  nonce?: number | string;
  pinned: boolean;
  webhook_id?: string;
  type: MessageType;
  activity?: APIMessageActivity;
  application?: Partial<APIApplication>;
  application_id?: string;
  flags?: number;
  message_reference?: APIMessageReference;
  message_snapshops?: Partial<APIMessage>[];
  referenced_message?: APIMessage;
  interaction_metadata?: APIMessageInteractionMetadata;
  /**
   * @deprecated use interaction_metadata
   */
  interaction?: APIMessageInteraction;
  thread?: APIChannel & APIThreadMember;
  components?: APIMessageComponent[];
  sticker_items?: APIStickerItem[];
  /**
   * @deprecated use sticker_items
   */
  stickers?: APISticker;
  position?: number;
  role_subscription_data?: APIRoleSubscriptionData;
  resolved?: APIResolvedData;
  poll?: APIPoll;
  call?: APIMessageCall;
};

export type Message = Library<APIMessage>;
