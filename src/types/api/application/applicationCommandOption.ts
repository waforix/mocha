import type { ApplicationCommandOptionType, ChannelType, Locale } from '../../../enums';
import type { Library } from '../../conversion';
import type { APIApplicationCommandOptionChoice } from './applicationCommandOptionChoice';

export type APIApplicationCommandOption = {
  type: ApplicationCommandOptionType;
  name: string;
  name_localizations: Record<Locale, string>;
  description: string;
  description_localizations: Record<Locale, string>;
  required?: boolean;
  choices?: APIApplicationCommandOptionChoice[];
  channel_types?: ChannelType[];
  min_value?: number;
  max_value?: number;
  min_length?: number;
  max_length?: number;
  autocomplete?: boolean;
};

export type ApplicationCommandOption = Library<APIApplicationCommandOption>;
