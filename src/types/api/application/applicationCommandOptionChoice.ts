import type { Locale } from '../../../../enums';
import type { Library } from '../../../conversion';

export type APIApplicationCommandOptionChoice = {
  name: string;
  name_localizations?: Record<Locale, string>;
  value: string;
};

export type ApplicationCommandOptionChoice = Library<APIApplicationCommandOptionChoice>;
