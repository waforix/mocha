import type { ComponentType } from "../../../../enums";
import type { Library } from "../../../conversion";
import type { APIButton } from "./button";
import type { APITextDisplay } from "./textDisplay";
import type { APIThumbnail } from "./thumbnail";

export type APISectionChild = APITextDisplay;

export type APISectionAccessory = APIButton | APIThumbnail;

export type APISection = {
    type: ComponentType.SECTION;
    id?: number;
    components: APISectionChild[];
    accessory: APISectionAccessory;
}

export type Section = Library<APISection>;