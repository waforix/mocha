import type { ReactionType } from "../../../../enums";
import type { Library } from "../../../conversion";
import type { Emoji } from "../../emoji/emoji";
import type { GuildMember } from "../../guild/guildMember";

export type APIMessageReaction = {
    user_id: string;
    channel_id: string;
    message_id: string;
    guild_id?: string;
    member?: GuildMember;
    emoji: Partial<Emoji>;
    message_author_id?: string;
    burst: boolean;
    burst_colors: string[];
    type: ReactionType;
};

export type MessageReaction = Library<APIMessageReaction>;