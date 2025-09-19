import { Locale } from "../../../enums";
import { Library } from "../../conversion";

export type APIApplicationCommandOptionChoice = {
    name: string;
    name_localizations?: Record<Locale, string>;
    value: string;
}

export type ApplicationCommandOptionChoice = Library<APIApplicationCommandOptionChoice>;