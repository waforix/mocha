import type { ComponentType } from "../../../../enums";
import type { Library } from "../../../conversion";
import type { APIStringSelect } from "./stringSelect";
import type { APITextDisplay } from "./textDisplay";

export type APILabelChild = APIStringSelect | APITextDisplay

export type APILabel = {
    type?: ComponentType.LABEL;
    id?: number;
    label: string;
    description?: string;
    component: APILabelChild;
}

export type Label = Library<APILabel>;