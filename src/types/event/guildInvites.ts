import { InviteTargetType } from "../../enums";
import { Application, User } from "../api";
import { Event } from "./event";

export type InviteCreate = Event<{
    channelId: string;
    code: string;
    createdAt: Date;
    guildId?: string;
    inviter?: User;
    maxAge: number;
    maxUses: number;
    targetType?: InviteTargetType;
    targetUser?: User;
    targetApplication?: Partial<Application>;
    temporary: boolean;
    uses: number;
    expiresAt: Date | null;
}>;

export type InviteDelete = Event<{ channelId: string; guildId?: string; code: string }>;