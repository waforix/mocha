import type { ComponentType } from "../../../../enums";
import type { Library } from "../../../conversion";
import type { APIUnfurledMediaItem } from "./unfurledMediaItem";

export type APIFile = {
    type: ComponentType.FILE;
    id?: number;
    file?: APIUnfurledMediaItem;
    spoiler?: boolean;
    name: string;
    size: number;
}

export type File = Library<APIFile>;