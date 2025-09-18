import { Library } from "../conversion";

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

/*
 * Note:
 *
 * "Holographic" Style
 * Primary Color = 11127295,
 * Secondary Color = 16759788,
 * Tertiary Color = 16761760
 * 
 */

export type APIRoleColors = {
    primary_color: number;
    secondary_color: number | null;
    tertiary_color: number | null;
}

export type APIRoleTags = {
    bot_id?: string;
    integration_id?: string;
    premium_subscriber?: null;
    subscription_listing_id?: string;
    available_for_purchase?: null;
    guild_connections?: null;
}

export type Role = Library<APIRole>;
export type RoleColors = Library<APIRoleColors>;
export type RoleTags = Library<APIRoleTags>;