import type { Library } from "../../conversion";
import type { APIRoleColors } from "./roleColors";
import type { APIRoleTags } from "./roleTags";

export type APIRole = {
    id: string;
    name: string;
    /**
     * @deprecated use colors object
     */
    color: number; 
    colors: APIRoleColors;
    hoist: boolean;
    icon?: string | null;
    unicode_emoji?: string | null;
    position: number;
    permissions: string;
    managed: boolean;
    mentionable: boolean;
    tags?: APIRoleTags;
    flags: number;
}

export type Role = Library<APIRole>;