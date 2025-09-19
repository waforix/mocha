import type { Library } from "../../../conversion";

export type APIEmbedField = {
    name: string;
    value: string;
    inline?: boolean;
}

export type EmbedField = Library<APIEmbedField>;