import { ComponentType } from "../../../../enums";
import { Library } from "../../../conversion";
import { APIFile } from "./file";
import { APIMediaGallery } from "./mediaGallery";
import { APISection } from "./section";
import { APISeparator } from "./separator";
import { APITextDisplay } from "./textDisplay";

export type APIContainerChild =
    APITextDisplay |
    APISection |
    APIMediaGallery |
    APISeparator |
    APIFile;

export type APIContainer = {
    type: ComponentType.CONTAINER;
    id?: number;
    components?: APIContainerChild[];
    accent_color?: number | null;
    spoiler?: boolean;
}

export type Container = Library<APIContainer>;