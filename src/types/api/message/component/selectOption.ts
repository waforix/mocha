import type { Library } from "../../../conversion";
import type { APIEmoji } from "../../emoji/emoji";

export type APISelectOption = {
    label: string;
    value: string;
    description?: string;
    emoji?: Partial<APIEmoji>;
    default?: boolean;
}

export type SelectOption = Library<APISelectOption>;