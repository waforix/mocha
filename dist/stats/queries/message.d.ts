import type { getDb } from '../../db/index';
export declare class MessageQueries {
    private db;
    constructor(db: ReturnType<typeof getDb>);
    getStats(guildId: string, userId?: string, days?: number): Promise<{
        count: number;
        attachments: string | null;
        embeds: string | null;
    }[]>;
    getTimeline(guildId: string, userId?: string, days?: number): Promise<{
        hour: number;
        count: number;
    }[]>;
}
