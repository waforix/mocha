import type { ComponentType } from "../../../../enums";
import type { Library } from "../../../conversion";
import type { APIButton } from "./button";
import type { APIChannelSelect, APIMentionableSelect, APIRoleSelect, APIUserSelect } from "./mentionableSelect";
import type { APIStringSelect } from "./stringSelect";

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