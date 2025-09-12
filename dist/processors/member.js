import { and, eq, isNull } from 'drizzle-orm';
import { schema } from '../db/index';
import { BaseProcessor } from './base';
export class MemberProcessor extends BaseProcessor {
    async processJoin(data) {
        await this.upsertUser(data.user);
        const userData = data.user;
        await this.db
            .insert(schema.members)
            .values({
            guildId: data.guild_id,
            userId: userData.id,
            roles: JSON.stringify(data.roles),
            joinedAt: new Date(data.joined_at),
        })
            .onConflictDoNothing();
        await this.db.insert(schema.memberEvents).values({
            guildId: data.guild_id,
            userId: userData.id,
            action: 'join',
            roles: JSON.stringify(data.roles),
            timestamp: new Date(),
        });
    }
    async processLeave(data) {
        const userData = data.user;
        await this.db
            .update(schema.members)
            .set({ leftAt: new Date() })
            .where(and(eq(schema.members.guildId, data.guild_id), eq(schema.members.userId, userData.id), isNull(schema.members.leftAt)));
        await this.db.insert(schema.memberEvents).values({
            guildId: data.guild_id,
            userId: userData.id,
            action: 'leave',
            timestamp: new Date(),
        });
    }
    async process() { }
}
