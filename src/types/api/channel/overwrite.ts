import { OverwriteType } from "../../../enums";
import { Library } from "../../conversion";

export type APIOverwrite = {
    id: string;
    type: OverwriteType;
    allow: string;
    deny: string;
}

export type Overwrite = Library<APIOverwrite>;