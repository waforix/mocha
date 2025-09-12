export interface GatewayPayload {
    op: number;
    d: unknown;
    s?: number;
    t?: string;
}
export interface GuildMember {
    user?: User;
    nick?: string;
    roles: string[];
    joined_at: string;
    premium_since?: string;
}
export interface User {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    bot?: boolean;
}
export interface Guild {
    id: string;
    name: string;
    icon?: string;
    owner_id: string;
    member_count?: number;
}
export interface Channel {
    id: string;
    type: number;
    guild_id?: string;
    name?: string;
    parent_id?: string;
}
export interface Message {
    id: string;
    channel_id: string;
    guild_id?: string;
    author: User;
    content: string;
    timestamp: string;
    edited_timestamp?: string;
    attachments: unknown[];
    embeds: unknown[];
}
export interface VoiceState {
    guild_id?: string;
    channel_id?: string;
    user_id: string;
    session_id: string;
    deaf: boolean;
    mute: boolean;
    self_deaf: boolean;
    self_mute: boolean;
}
export interface PresenceUpdate {
    user: Partial<User>;
    guild_id: string;
    status: 'online' | 'idle' | 'dnd' | 'offline';
    activities: Activity[];
}
export interface Activity {
    name: string;
    type: number;
    url?: string;
    created_at: number;
    timestamps?: {
        start?: number;
        end?: number;
    };
}
