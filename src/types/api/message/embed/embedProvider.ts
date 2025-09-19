import { Library } from "../../../conversion";

export type APIEmbedProvider = {
    name?: string;
    url?: string;
}

export type EmbedProvider = Library<APIEmbedProvider>;