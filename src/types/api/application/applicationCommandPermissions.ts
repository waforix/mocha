import type { Library } from "../../conversion";
import type { APIApplicationCommandPermission } from "./applicationCommandPermission";

export type APIApplicationCommandPermissions = {
    id: string;
    application_id: string;
    guild_id: string;
    permissions: APIApplicationCommandPermission[];
}

export type ApplicationCommandPermissions = Library<APIApplicationCommandPermissions>;