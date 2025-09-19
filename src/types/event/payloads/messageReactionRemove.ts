import type { ReactionType } from "../../../enums";
import type { Emoji } from "../../api";

export type MessageReactionRemove = {
    user_id: string;
    channel_id: string;
    message_id: string;
    guild_id?: string;
    emoji: Partial<Emoji>;
    burst: boolean;
    type: ReactionType;
}