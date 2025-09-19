import { ComponentType } from "../../../../enums";
import { Library } from "../../../conversion";
import { APIButton } from "./button";
import { APIChannelSelect, APIMentionableSelect, APIRoleSelect, APIUserSelect } from "./mentionableSelect";
import { APIStringSelect } from "./stringSelect";

export type APIActionRowChild = APIButton |
    APIStringSelect |
    APIUserSelect |
    APIRoleSelect |
    APIMentionableSelect |
    APIChannelSelect;

export type APIActionRow<T extends APIActionRowChild> = {
    type: ComponentType.ACTION_ROW;
    id?: number;
    components: T[];
}

export type ActionRow<T extends APIActionRowChild> = Library<APIActionRow<T>>;