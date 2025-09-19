import { ComponentType } from "../../../enums";
import { Library } from "../../conversion";
import { APIUnfurledMediaItem } from "./unfurledMediaItem";

export type APIFile = {
    type: ComponentType.FILE;
    id?: number;
    file?: APIUnfurledMediaItem;
    spoiler?: boolean;
    name: string;
    size: number;
}

export type File = Library<APIFile>;