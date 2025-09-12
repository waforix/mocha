import { BaseProcessor } from './base';
export declare class MemberProcessor extends BaseProcessor {
    processJoin(data: {
        guild_id: string;
        user: unknown;
        roles: string[];
        joined_at: string;
    }): Promise<void>;
    processLeave(data: {
        guild_id: string;
        user: unknown;
    }): Promise<void>;
    process(): Promise<void>;
}
