export type MessagePollVote = {
    user_id: string;
    channel_id: string;
    message_id: string;
    guild_id?: string;
    answer_id?: number;
}