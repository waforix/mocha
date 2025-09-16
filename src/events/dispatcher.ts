import { EventEmitter } from 'node:events';
import type { CommonDatabase } from '../db/index';
import { EVENTS } from '../gateway/constants';
import {
  AutoModerationProcessor,
  ChannelProcessor,
  GuildProcessor,
  InteractionProcessor,
  InviteProcessor,
  MemberProcessor,
  MessageProcessor,
  PresenceProcessor,
  ReactionProcessor,
  RoleProcessor,
  ScheduledEventProcessor,
  VoiceProcessor,
} from '../processors/index';
import type { APIMessage, APIPresenceUpdate, APIVoiceState } from '../types/index';

export class EventDispatcher extends EventEmitter {
  private messageProcessor: MessageProcessor;
  private voiceProcessor: VoiceProcessor;
  private memberProcessor: MemberProcessor;
  private presenceProcessor: PresenceProcessor;
  private reactionProcessor: ReactionProcessor;
  private guildProcessor: GuildProcessor;
  private channelProcessor: ChannelProcessor;
  private roleProcessor: RoleProcessor;
  private interactionProcessor: InteractionProcessor;
  private inviteProcessor: InviteProcessor;
  private scheduledEventProcessor: ScheduledEventProcessor;
  private autoModerationProcessor: AutoModerationProcessor;

  constructor(db: CommonDatabase) {
    super();
    this.messageProcessor = new MessageProcessor(db);
    this.voiceProcessor = new VoiceProcessor(db);
    this.memberProcessor = new MemberProcessor(db);
    this.presenceProcessor = new PresenceProcessor(db);
    this.reactionProcessor = new ReactionProcessor(db);
    this.guildProcessor = new GuildProcessor(db);
    this.channelProcessor = new ChannelProcessor(db);
    this.roleProcessor = new RoleProcessor(db);
    this.interactionProcessor = new InteractionProcessor(db);
    this.inviteProcessor = new InviteProcessor(db);
    this.scheduledEventProcessor = new ScheduledEventProcessor(db);
    this.autoModerationProcessor = new AutoModerationProcessor(db);
  }

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
        case EVENTS.CHANNEL_CREATE:
          await this.channelProcessor.processCreate(data as any);
          break;
        case EVENTS.CHANNEL_UPDATE:
          await this.channelProcessor.processUpdate(data as any);
          break;
        case EVENTS.CHANNEL_DELETE:
          await this.channelProcessor.processDelete(data as any);
          break;
        case EVENTS.THREAD_CREATE:
          await this.channelProcessor.processThreadCreate(data as any);
          break;
        case EVENTS.THREAD_UPDATE:
          await this.channelProcessor.processThreadUpdate(data as any);
          break;
        case EVENTS.THREAD_DELETE:
          await this.channelProcessor.processThreadDelete(data as any);
          break;
        case EVENTS.GUILD_ROLE_CREATE:
          await this.roleProcessor.processCreate(data as any);
          break;
        case EVENTS.GUILD_ROLE_UPDATE:
          await this.roleProcessor.processUpdate(data as any);
          break;
        case EVENTS.GUILD_ROLE_DELETE:
          await this.roleProcessor.processDelete(data as any);
          break;
        case EVENTS.INTERACTION_CREATE:
          await this.interactionProcessor.process(data as any);
          break;
        case EVENTS.INVITE_CREATE:
          await this.inviteProcessor.processCreate(data as any);
          break;
        case EVENTS.INVITE_DELETE:
          await this.inviteProcessor.processDelete(data as any);
          break;
        case EVENTS.GUILD_SCHEDULED_EVENT_CREATE:
          await this.scheduledEventProcessor.processCreate(data as any);
          break;
        case EVENTS.GUILD_SCHEDULED_EVENT_UPDATE:
          await this.scheduledEventProcessor.processUpdate(data as any);
          break;
        case EVENTS.GUILD_SCHEDULED_EVENT_DELETE:
          await this.scheduledEventProcessor.processDelete(data as any);
          break;
        case EVENTS.GUILD_SCHEDULED_EVENT_USER_ADD:
          await this.scheduledEventProcessor.processUserAdd(data as any);
          break;
        case EVENTS.GUILD_SCHEDULED_EVENT_USER_REMOVE:
          await this.scheduledEventProcessor.processUserRemove(data as any);
          break;
        case EVENTS.AUTO_MODERATION_RULE_CREATE:
          await this.autoModerationProcessor.processRuleCreate(data as any);
          break;
        case EVENTS.AUTO_MODERATION_RULE_UPDATE:
          await this.autoModerationProcessor.processRuleUpdate(data as any);
          break;
        case EVENTS.AUTO_MODERATION_RULE_DELETE:
          await this.autoModerationProcessor.processRuleDelete(data as any);
          break;
        case EVENTS.AUTO_MODERATION_ACTION_EXECUTION:
          await this.autoModerationProcessor.processActionExecution(data as any);
          break;
      }

      this.emit('processed', event, data);
    } catch (error) {
      this.emit('error', error, event, data);
    }
  }
}
