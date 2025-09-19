import type { GuildInviteFlag, InviteTargetType, InviteType } from "../../../enums";
import type { Library } from "../../conversion";
import type { APIApplication } from "../application/application";
import type { APIChannel } from "../channel/channel";
import type { APIGuild } from "../guild/guild";
import type { APIGuildScheduledEvent } from "../guildScheduledEvent/guildScheduledEvent";
import type { APIUser } from "../user/user";

export type APIInvite = {
    type: InviteType;
    code: string;
    guild?: Partial<APIGuild>;
    channel: Partial<APIChannel> | null;
    inviter?: APIUser;
    target_type?: InviteTargetType;
    target_user?: APIUser;
    target_application?: Partial<APIApplication>;
    approximate_presence_count?: number;
    approximate_member_count?: number;
    expires_at: Date | null;
    guild_scheduled_event?: APIGuildScheduledEvent;
    flags?: GuildInviteFlag;
}

export type Invite = Library<APIInvite>;