import type { getDb } from '../../db/index';
export declare class ChannelQueries {
    private db;
    constructor(db: ReturnType<typeof getDb>);
    getStats(guildId: string, days?: number): Promise<{
        channelId: string;
        channelName: string | null;
        messageCount: number;
        uniqueUsers: number;
    }[]>;
}
