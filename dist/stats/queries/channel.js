import { and, count, desc, eq, gte, sql } from 'drizzle-orm';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';
export class ChannelQueries {
    db;
    constructor(db) {
        this.db = db;
    }
    async getStats(guildId, days = 30) {
        const since = createDateSince(days);
        return await this.db
            .select({
            channelId: schema.messageEvents.channelId,
            channelName: schema.channels.name,
            messageCount: count(),
            uniqueUsers: sql `COUNT(DISTINCT ${schema.messageEvents.userId})`,
        })
            .from(schema.messageEvents)
            .innerJoin(schema.channels, eq(schema.messageEvents.channelId, schema.channels.id))
            .where(and(eq(schema.messageEvents.guildId, guildId), gte(schema.messageEvents.timestamp, since)))
            .groupBy(schema.messageEvents.channelId, schema.channels.name)
            .orderBy(desc(count()));
    }
}
