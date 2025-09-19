import { Library } from "../../../conversion";

export type APIEmbedFooter = {
    text: string;
    icon_url?: string;
    proxy_icon_url?: string;
}

export type EmbedFooter = Library<APIEmbedFooter>;