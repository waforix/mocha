import { schema } from '../db/index';
import { BaseProcessor } from './base';
export class MessageProcessor extends BaseProcessor {
    async process(message) {
        if (!message.guild_id || message.author.bot)
            return;
        await this.upsertUser(message.author);
        await this.upsertChannel(message);
        await this.db.insert(schema.messageEvents).values({
            id: message.id,
            guildId: message.guild_id,
            channelId: message.channel_id,
            userId: message.author.id,
            content: message.content.slice(0, 2000),
            attachmentCount: message.attachments?.length || 0,
            embedCount: message.embeds?.length || 0,
            timestamp: new Date(message.timestamp),
        });
    }
}
