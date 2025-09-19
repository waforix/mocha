import { APIGuild } from "../guild/guild";
import { Library } from "../../conversion";
import { APIChannel } from "../channel/channel";
import { APIUser } from "../user/user";

export type APIWebhook = {
    id: string;
    type: number;
    guild_id?: string | null;
    channel_id: string | null;
    user?: APIUser;
    name: string | null;
    avatar: string | null;
    token?: string;
    application_id: string | null;
    source_guild?: Partial<APIGuild>;
    source_channel?: Partial<APIChannel>;
    url?: string;
}

export type Webhook = Library<APIWebhook>;