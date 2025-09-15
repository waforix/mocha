import { EventEmitter } from 'node:events';
import { getDb } from '../db/index';
import { EVENTS } from '../gateway/constants';
import {
  GuildProcessor,
  MemberProcessor,
  MessageProcessor,
  PresenceProcessor,
  ReactionProcessor,
  VoiceProcessor,
} from '../processors/index';
import type { APIMessage, APIPresenceUpdate, APIVoiceState } from '../types/index';

export class EventDispatcher extends EventEmitter {
  private db = getDb();
  private messageProcessor = new MessageProcessor(this.db);
  private voiceProcessor = new VoiceProcessor(this.db);
  private memberProcessor = new MemberProcessor(this.db);
  private presenceProcessor = new PresenceProcessor(this.db);
  private reactionProcessor = new ReactionProcessor(this.db);
  private guildProcessor = new GuildProcessor(this.db);

  async dispatch(event: string, data: unknown) {
    try {
      switch (event) {
        case EVENTS.MESSAGE_CREATE:
          await this.messageProcessor.process(data as APIMessage);
          break;
        case EVENTS.VOICE_STATE_UPDATE:
          await this.voiceProcessor.process(data as APIVoiceState);
          break;
        case EVENTS.GUILD_MEMBER_ADD:
          await this.memberProcessor.processJoin(
            data as { guild_id: string; user: unknown; roles: string[]; joined_at: string }
          );
          break;
        case EVENTS.GUILD_MEMBER_REMOVE:
          await this.memberProcessor.processLeave(data as { guild_id: string; user: unknown });
          break;
        case EVENTS.PRESENCE_UPDATE:
          await this.presenceProcessor.process(data as APIPresenceUpdate);
          break;
        case EVENTS.GUILD_CREATE:
          await this.guildProcessor.process(data);
          break;
        case EVENTS.MESSAGE_REACTION_ADD:
          await this.reactionProcessor.processAdd(
            data as {
              guild_id: string;
              channel_id: string;
              message_id: string;
              user_id: string;
              emoji: { id?: string; name: string; animated?: boolean };
            }
          );
          break;
        case EVENTS.MESSAGE_REACTION_REMOVE:
          await this.reactionProcessor.processRemove(
            data as {
              guild_id: string;
              channel_id: string;
              message_id: string;
              user_id: string;
              emoji: { id?: string; name: string; animated?: boolean };
            }
          );
          break;
      }

      this.emit('processed', event, data);
    } catch (error) {
      this.emit('error', error, event, data);
    }
  }
}
