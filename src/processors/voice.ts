import type { APIVoiceState } from '../types/index';
import { BaseProcessor } from './base';

export class VoiceProcessor extends BaseProcessor<APIVoiceState> {
  private voiceSessions = new Map<string, { channelId: string; joinTime: Date }>();

  /**
   * Process a voice state update event
   */
  async process(voiceState: APIVoiceState) {
    if (!this.validateVoiceState(voiceState)) {
      return;
    }

    if (!voiceState.guild_id) {
      return;
    }

    try {
      const sessionKey = `${voiceState.guild_id}:${voiceState.user_id}`;
      const currentSession = this.voiceSessions.get(sessionKey);

      if (!voiceState.channel_id) {
        if (currentSession) {
          const duration = Date.now() - currentSession.joinTime.getTime();

          await this.db.voiceEvent.create({
            data: {
              guildId: voiceState.guild_id,
              channelId: currentSession.channelId,
              userId: voiceState.user_id,
              action: 'leave',
              duration: Math.floor(duration / 1000),
              timestamp: new Date(),
            },
          });

          this.voiceSessions.delete(sessionKey);
        }
      } else {
        if (currentSession) {
          if (currentSession.channelId !== voiceState.channel_id) {
            const duration = Date.now() - currentSession.joinTime.getTime();

            await this.db.voiceEvent.create({
              data: {
                guildId: voiceState.guild_id,
                channelId: currentSession.channelId,
                userId: voiceState.user_id,
                action: 'leave',
                duration: Math.floor(duration / 1000),
                timestamp: new Date(),
              },
            });

            await this.db.voiceEvent.create({
              data: {
                guildId: voiceState.guild_id,
                channelId: voiceState.channel_id,
                userId: voiceState.user_id,
                action: 'join',
                timestamp: new Date(),
              },
            });

            this.voiceSessions.set(sessionKey, {
              channelId: voiceState.channel_id,
              joinTime: new Date(),
            });
          }
        } else {
          await this.db.voiceEvent.create({
            data: {
              guildId: voiceState.guild_id,
              channelId: voiceState.channel_id,
              userId: voiceState.user_id,
              action: 'join',
              timestamp: new Date(),
            },
          });

          this.voiceSessions.set(sessionKey, {
            channelId: voiceState.channel_id,
            joinTime: new Date(),
          });
        }
      }
    } catch (error) {
      throw new Error(`Failed to process voice state: ${error}`);
    }
  }

  private validateVoiceState(voiceState: unknown): voiceState is APIVoiceState {
    if (!voiceState || typeof voiceState !== 'object') {
      return false;
    }

    const vs = voiceState as Record<string, unknown>;

    return !!(
      vs.user_id &&
      typeof vs.user_id === 'string' &&
      (vs.guild_id === null || typeof vs.guild_id === 'string') &&
      (vs.channel_id === null || typeof vs.channel_id === 'string')
    );
  }
}
