import { ComponentType } from "../../../enums";
import { Library } from "../../conversion";
import { APIStringSelect } from "./stringSelect";
import { APITextDisplay } from "./textDisplay";

export type APILabelChild = APIStringSelect | APITextDisplay

export type APILabel = {
    type?: ComponentType.LABEL;
    id?: number;
    label: string;
    description?: string;
    component: APILabelChild;
}

export type Label = Library<APILabel>;