import { ComponentType } from "../../../enums";
import { Library } from "../../conversion";
import { APIMediaGalleryItem } from "./mediaGalleryItem";

export type APIMediaGallery = {
    type: ComponentType.MEDIA_GALLERY;
    id?: number;
    items: APIMediaGalleryItem[];
}

export type MediaGallery = Library<APIMediaGallery>;