import type { getDb } from '../../db/index';
export declare class UserQueries {
    private db;
    constructor(db: ReturnType<typeof getDb>);
    getTop(guildId: string, type: 'messages' | 'voice', limit?: number, days?: number): Promise<{
        userId: string;
        username: string;
        count: number;
    }[] | {
        userId: string;
        username: string;
        totalTime: string | null;
    }[]>;
}
