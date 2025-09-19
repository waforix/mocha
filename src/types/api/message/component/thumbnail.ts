import { ComponentType } from "../../../enums";
import { Library } from "../../conversion";
import { APIUnfurledMediaItem } from "./unfurledMediaItem";

export type APIThumbnail = {
    type?: ComponentType.THUMBNAIL;
    id?: number;
    media: APIUnfurledMediaItem;
    description?: string;
    spoiler?: boolean;
}

export type Thumbnail = Library<APIThumbnail>;