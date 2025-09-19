import type { ApplicationCommandPermissionType } from "../../../enums";
import type { Library } from "../../conversion";

export type APIApplicationCommandPermission = {
    id: string;
    type: ApplicationCommandPermissionType;
    permission: boolean;
}

export type ApplicationCommandPermission = Library<APIApplicationCommandPermission>;