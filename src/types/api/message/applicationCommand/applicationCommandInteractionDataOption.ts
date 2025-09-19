import { ApplicationCommandOptionType } from "../../../../enums";
import { Library } from "../../../conversion";

export type APIApplicationCommandInteractionDataOption = {
    name: string;
    type: ApplicationCommandOptionType;
    value?: string | number | boolean;
    options?: APIApplicationCommandInteractionDataOption[];
    focused?: boolean;
}

export type ApplicationCommandInteractionDataOption = Library<APIApplicationCommandInteractionDataOption>;