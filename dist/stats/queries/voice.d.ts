import type { getDb } from '../../db/index';
export declare class VoiceQueries {
    private db;
    constructor(db: ReturnType<typeof getDb>);
    getStats(guildId: string, userId?: string, days?: number): Promise<{
        totalTime: string | null;
        sessions: number;
    }>;
}
