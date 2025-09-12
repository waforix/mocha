import type { getDb } from '../../db/index';
export declare class MemberQueries {
    private db;
    constructor(db: ReturnType<typeof getDb>);
    getGrowth(guildId: string, days?: number): Promise<{
        joins: {
            date: string;
            joins: number;
        }[];
        leaves: {
            date: string;
            leaves: number;
        }[];
    }>;
}
