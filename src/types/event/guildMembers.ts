import { GuildMember, Role, User } from "../api";
import { Event } from "./event";

export type GuildMemberAdd = Event<GuildMember & { guildId: string }>;

export type GuildMemberUpdate = Event<
    Omit<Partial<GuildMember>, "user" | "roles" | "avatar" | "banner" | "joinedAt"> & {
        guildId: string;
        user: User;
        roles: Role[];
        avatar: string | null;
        banner: string | null;
        joinedAt: Date;
    }
>;

export type GuildMemberRemove = Event<{ guildId: string; user: User }>;