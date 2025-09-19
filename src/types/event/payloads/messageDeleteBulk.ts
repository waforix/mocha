export type MessageDeleteBulk = {
    ids: string[];
    channel_id: string;
    guild_id?: string;
}