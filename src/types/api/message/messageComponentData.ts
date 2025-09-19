import { ComponentType } from "../../../enums";
import { Library } from "../../conversion";
import { APIResolvedData } from "./resolvedData";

export type APIMessageComponentData = {
    custom_id: string;
    component_type: ComponentType;
    values?: string;
    resolved?: APIResolvedData;
}

export type MessageComponentData = Library<APIMessageComponentData>;