import type { ApplicationCommandOptionType } from '../../../../enums';
import type { Library } from '../../../conversion';

export type APIApplicationCommandInteractionDataOption = {
  name: string;
  type: ApplicationCommandOptionType;
  value?: string | number | boolean;
  options?: APIApplicationCommandInteractionDataOption[];
  focused?: boolean;
};

export type ApplicationCommandInteractionDataOption =
  Library<APIApplicationCommandInteractionDataOption>;
