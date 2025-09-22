import { Library } from "../../conversion";

export type APIPollVote = {
    user_id: string;
    channel_id: string;
    message_id: string;
    guild_id?: string;
    answer_id: number;
}

export type PollVote = Library<APIPollVote>;