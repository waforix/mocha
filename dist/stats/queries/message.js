import { and, count, eq, gte, sql, sum } from 'drizzle-orm';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';
export class MessageQueries {
    db;
    constructor(db) {
        this.db = db;
    }
    async getStats(guildId, userId, days = 30) {
        const since = createDateSince(days);
        return await this.db
            .select({
            count: count(),
            attachments: sum(schema.messageEvents.attachmentCount),
            embeds: sum(schema.messageEvents.embedCount),
        })
            .from(schema.messageEvents)
            .where(and(eq(schema.messageEvents.guildId, guildId), gte(schema.messageEvents.timestamp, since), userId ? eq(schema.messageEvents.userId, userId) : undefined));
    }
    async getTimeline(guildId, userId, days = 7) {
        const since = createDateSince(days);
        return await this.db
            .select({
            hour: sql `strftime('%H', ${schema.messageEvents.timestamp})`,
            count: count(),
        })
            .from(schema.messageEvents)
            .where(and(eq(schema.messageEvents.guildId, guildId), gte(schema.messageEvents.timestamp, since), userId ? eq(schema.messageEvents.userId, userId) : undefined))
            .groupBy(sql `strftime('%H', ${schema.messageEvents.timestamp})`)
            .orderBy(sql `strftime('%H', ${schema.messageEvents.timestamp})`);
    }
}
