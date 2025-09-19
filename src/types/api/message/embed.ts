import { EmbedType } from "../../../enums";
import { Library } from "../../conversion";

export type APIEmbed = {
    title?: string;
    type?: EmbedType;
    description?: string;
    url?: string;
    timestamp?: Date;
    color?: number;
    footer?: APIEmbedFooter;
    image?: APIEmbedImage;
    thumbnail?: APIEmbedThumbnail;
    video?: APIEmbedVideo;
    provider?: APIEmbedProvider;
    author?: APIEmbedAuthor;
    fields?: APIEmbedField[];
}

export type APIEmbedThumbnail = {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

export type APIEmbedVideo = {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

export type APIEmbedImage = {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

export type APIEmbedProvider = {
    name?: string;
    url?: string;
}

export type APIEmbedAuthor = {
    name: string;
    url?: string;
    icon_url?: string;
    proxy_icon_url?: string;
}

export type APIEmbedFooter = {
    text: string;
    icon_url?: string;
    proxy_icon_url?: string;
}

export type APIEmbedField = {
    name: string;
    value: string;
    inline?: boolean;
}

export type Embed = Library<APIEmbed>;
export type EmbedThumbnail = Library<APIEmbedThumbnail>;
export type EmbedVideo = Library<APIEmbedVideo>;
export type EmbedImage = Library<APIEmbedImage>;
export type EmbedProvider = Library<APIEmbedProvider>;
export type EmbedAuthor = Library<APIEmbedAuthor>;
export type EmbedFooter = Library<APIEmbedFooter>;
export type EmbedField = Library<APIEmbedField>;