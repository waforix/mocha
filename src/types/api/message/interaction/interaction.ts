import type {
  ApplicationIntegrationType,
  InteractionContextType,
  InteractionType,
  Locale,
} from '../../../../enums';
import type { Library } from '../../../conversion';
import type { APIChannel } from '../../channel/channel';
import type { APIEntitlement } from '../../entitlement/entitlement';
import type { APIGuild } from '../../guild/guild';
import type { APIGuildMember } from '../../guild/guildMember';
import type { APIUser } from '../../user/user';
import type { APIApplicationCommandData } from '../applicationCommand/applicationCommandData';
import type { AuthorizingIntegrationOwner } from './../authorizingIntegrationOwner';
import type { APIMessage } from './../message';

export type APIInteraction = {
  id: string;
  application_id: string;
  type: InteractionType;
  data?: APIApplicationCommandData;
  guild?: Partial<APIGuild>;
  guild_id?: string;
  channel?: Partial<APIChannel>;
  channel_id?: string;
  member?: APIGuildMember;
  user?: APIUser;
  token: string;
  version: number;
  message?: APIMessage;
  app_permissions: string;
  locale?: Locale;
  guild_locale?: string;
  entitlements: APIEntitlement[];
  authorization_integration_owners: Record<
    ApplicationIntegrationType,
    AuthorizingIntegrationOwner<ApplicationIntegrationType, InteractionContextType>
  >;
  context?: InteractionContextType;
  attachment_size_limit: number;
};

export type Interaction = Library<APIInteraction>;
