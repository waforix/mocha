import { and, count, eq, gte, sum } from 'drizzle-orm';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';
export class VoiceQueries {
    db;
    constructor(db) {
        this.db = db;
    }
    async getStats(guildId, userId, days = 30) {
        const since = createDateSince(days);
        const result = await this.db
            .select({
            totalTime: sum(schema.voiceEvents.duration),
            sessions: count(),
        })
            .from(schema.voiceEvents)
            .where(and(eq(schema.voiceEvents.guildId, guildId), eq(schema.voiceEvents.action, 'leave'), gte(schema.voiceEvents.timestamp, since), userId ? eq(schema.voiceEvents.userId, userId) : undefined));
        return result[0];
    }
}
