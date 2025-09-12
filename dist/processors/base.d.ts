import type { getDb } from '../db/index';
export declare abstract class BaseProcessor<T = unknown> {
    protected db: ReturnType<typeof getDb>;
    constructor(db: ReturnType<typeof getDb>);
    abstract process(data: T): Promise<void>;
    protected upsertUser(user: unknown): Promise<void>;
    protected upsertGuild(guild: unknown): Promise<void>;
    protected upsertChannel(channel: unknown): Promise<void>;
}
