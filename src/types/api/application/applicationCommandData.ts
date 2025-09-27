import type {
  ApplicationCommandType,
  CommandHandlerType,
  IntegrationType,
  InteractionContextType,
  Locale,
} from '../../../enums';
import type { Library } from '../../conversion';
import type { APIApplicationCommandOption } from './applicationCommandOption';

export type APIApplicationCommandData = {
  id: string;
  type?: ApplicationCommandType;
  application_id: string;
  guild_id?: string;
  name: string;
  name_localizations?: Record<Locale, string>;
  description: string;
  description_localizations?: Record<Locale, string>;
  options?: APIApplicationCommandOption[];
  default_member_permissions: string | null;
  /**
   * @deprecated use contexts instead
   */
  dm_permission?: boolean;
  default_permissions?: boolean | null;
  nsfw?: boolean;
  integration_types?: IntegrationType[];
  contexts?: InteractionContextType[] | null;
  version: string;
  handler?: CommandHandlerType;
};

export type ApplicationCommandData = Library<APIApplicationCommandData>;
