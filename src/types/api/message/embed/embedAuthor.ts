import type { Library } from "../../../conversion";

export type APIEmbedAuthor = {
    name: string;
    url?: string;
    icon_url?: string;
    proxy_icon_url?: string;
}

export type EmbedAuthor = Library<APIEmbedAuthor>;