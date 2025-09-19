import { Library } from "../../../conversion";

export type APIEmbedImage = {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

export type EmbedImage = Library<APIEmbedImage>;