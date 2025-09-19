import type { Library } from "../../../conversion";

export type APIEmbedVideo = {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

export type EmbedVideo = Library<APIEmbedVideo>;