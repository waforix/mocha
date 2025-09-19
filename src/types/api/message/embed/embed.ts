import { EmbedType } from "../../../../enums";
import { Library } from "../../../conversion";
import { APIEmbedAuthor } from "./embedAuthor";
import { APIEmbedField } from "./embedField";
import { APIEmbedFooter } from "./embedFooter";
import { APIEmbedImage } from "./embedImage";
import { APIEmbedProvider } from "./embedProvider";
import { APIEmbedThumbnail } from "./embedThumbnail";
import { APIEmbedVideo } from "./embedVideo";

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

export type Embed = Library<APIEmbed>;