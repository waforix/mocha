import { Library } from "../../conversion";
import { APIUnfurledMediaItem } from "./unfurledMediaItem";

export type APIMediaGalleryItem = {
    media: APIUnfurledMediaItem;
    description?: string;
    spoiler?: boolean;
}

export type MediaGalleryItem = Library<APIMediaGalleryItem>;