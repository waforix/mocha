import { schema } from '../db/index';
import type { APIVoiceState } from '../types/index';
import { BaseProcessor } from './base';

export class VoiceProcessor extends BaseProcessor<APIVoiceState> {
  private voiceSessions = new Map<string, { channelId: string; joinTime: Date }>();

  async process(voiceState: APIVoiceState) {
    if (!voiceState.guild_id) return;

    const sessionKey = `${voiceState.guild_id}:${voiceState.user_id}`;
    const currentSession = this.voiceSessions.get(sessionKey);

    if (!voiceState.channel_id) {
      if (currentSession) {
        const duration = Date.now() - currentSession.joinTime.getTime();

        await this.db.insert(schema.voiceEvents).values({
          guildId: voiceState.guild_id,
          channelId: currentSession.channelId,
          userId: voiceState.user_id,
          action: 'leave',
          duration: Math.floor(duration / 1000),
          timestamp: new Date(),
        });

        this.voiceSessions.delete(sessionKey);
      }
    } else {
      if (currentSession) {
        if (currentSession.channelId !== voiceState.channel_id) {
          const duration = Date.now() - currentSession.joinTime.getTime();

          await this.db.insert(schema.voiceEvents).values({
            guildId: voiceState.guild_id,
            channelId: currentSession.channelId,
            userId: voiceState.user_id,
            action: 'leave',
            duration: Math.floor(duration / 1000),
            timestamp: new Date(),
          });

          await this.db.insert(schema.voiceEvents).values({
            guildId: voiceState.guild_id,
            channelId: voiceState.channel_id,
            userId: voiceState.user_id,
            action: 'join',
            timestamp: new Date(),
          });

          this.voiceSessions.set(sessionKey, {
            channelId: voiceState.channel_id,
            joinTime: new Date(),
          });
        }
      } else {
        await this.db.insert(schema.voiceEvents).values({
          guildId: voiceState.guild_id,
          channelId: voiceState.channel_id,
          userId: voiceState.user_id,
          action: 'join',
          timestamp: new Date(),
        });

        this.voiceSessions.set(sessionKey, {
          channelId: voiceState.channel_id,
          joinTime: new Date(),
        });
      }
    }
  }
}
