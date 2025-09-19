import { ComponentType } from "../../../enums";
import { Library } from "../../conversion";
import { APIButton } from "./button";
import { APITextDisplay } from "./textDisplay";
import { APIThumbnail } from "./thumbnail";

export type APISectionChild = APITextDisplay;

export type APISectionAccessory = APIButton | APIThumbnail;

export type APISection = {
    type: ComponentType.SECTION;
    id?: number;
    components: APISectionChild[];
    accessory: APISectionAccessory;
}

export type Section = Library<APISection>;