import type { Library } from "../../../conversion";

export type APIEmbedThumbnail = {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

export type EmbedThumbnail = Library<APIEmbedThumbnail>;