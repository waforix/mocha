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

interface ChannelData {
  id: string;
  type: number;
  guild_id?: string;
  name?: string;
  parent_id?: string;
  thread_metadata?: {
    archived?: boolean;
    auto_archive_duration?: number;
    archive_timestamp?: string;
    locked?: boolean;
  };
}

interface RoleData {
  id: string;
  guild_id: string;
  name: string;
  color: number;
  permissions: string;
  position: number;
  hoist?: boolean;
  mentionable?: boolean;
  managed?: boolean;
}

interface InteractionData {
  id: string;
  type: number;
  guild_id?: string;
  channel_id?: string;
  user?: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    bot?: boolean;
  };
  member?: {
    user: {
      id: string;
      username: string;
      discriminator: string;
      avatar?: string;
      bot?: boolean;
    };
  };
  data?: {
    name?: string;
    custom_id?: string;
  };
  message?: {
    id: string;
    channel_id: string;
    thread?: {
      id: string;
      parent_id?: string;
    };
  };
}

interface InviteData {
  code: string;
  guild_id: string;
  channel_id?: string;
  inviter?: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    bot?: boolean;
  };
  max_age?: number;
  max_uses?: number;
  temporary?: boolean;
  created_at?: string;
}

interface ScheduledEventData {
  id: string;
  guild_id: string;
  name?: string;
  description?: string;
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  entity_type?: number;
  status?: number;
}

interface ScheduledEventUserData {
  guild_scheduled_event_id: string;
  user_id: string;
  guild_id: string;
}

interface AutoModerationRuleData {
  id: string;
  guild_id: string;
  name: string;
  creator_id: string;
  event_type: number;
  trigger_type: number;
  trigger_metadata?: Record<string, unknown>;
  actions: Array<{
    type: number;
    metadata?: Record<string, unknown>;
  }>;
  enabled?: boolean;
}

interface AutoModerationActionData {
  guild_id: string;
  action: {
    type: number;
    metadata?: Record<string, unknown>;
  };
  rule_id: string;
  rule_trigger_type: number;
  user_id: string;
  channel_id?: string;
  message_id?: string;
  alert_system_message_id?: string;
  content?: string;
  matched_keyword?: string;
  matched_content?: string;
}

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
          await this.channelProcessor.processCreate(data as ChannelData);
          break;
        case EVENTS.CHANNEL_UPDATE:
          await this.channelProcessor.processUpdate(data as ChannelData);
          break;
        case EVENTS.CHANNEL_DELETE:
          await this.channelProcessor.processDelete(data as ChannelData);
          break;
        case EVENTS.THREAD_CREATE:
          await this.channelProcessor.processThreadCreate(data as ChannelData);
          break;
        case EVENTS.THREAD_UPDATE:
          await this.channelProcessor.processThreadUpdate(data as ChannelData);
          break;
        case EVENTS.THREAD_DELETE:
          await this.channelProcessor.processThreadDelete(data as ChannelData);
          break;
        case EVENTS.GUILD_ROLE_CREATE:
          await this.roleProcessor.processCreate(data as RoleData);
          break;
        case EVENTS.GUILD_ROLE_UPDATE:
          await this.roleProcessor.processUpdate(data as RoleData);
          break;
        case EVENTS.GUILD_ROLE_DELETE:
          await this.roleProcessor.processDelete(data as RoleData);
          break;
        case EVENTS.INTERACTION_CREATE:
          await this.interactionProcessor.process(data as InteractionData);
          break;
        case EVENTS.INVITE_CREATE:
          await this.inviteProcessor.processCreate(data as InviteData);
          break;
        case EVENTS.INVITE_DELETE:
          await this.inviteProcessor.processDelete(
            data as { code: string; guild_id: string; channel_id?: string }
          );
          break;
        case EVENTS.GUILD_SCHEDULED_EVENT_CREATE:
          await this.scheduledEventProcessor.processCreate(data as ScheduledEventData);
          break;
        case EVENTS.GUILD_SCHEDULED_EVENT_UPDATE:
          await this.scheduledEventProcessor.processUpdate(data as ScheduledEventData);
          break;
        case EVENTS.GUILD_SCHEDULED_EVENT_DELETE:
          await this.scheduledEventProcessor.processDelete(data as ScheduledEventData);
          break;
        case EVENTS.GUILD_SCHEDULED_EVENT_USER_ADD:
          await this.scheduledEventProcessor.processUserAdd(data as ScheduledEventUserData);
          break;
        case EVENTS.GUILD_SCHEDULED_EVENT_USER_REMOVE:
          await this.scheduledEventProcessor.processUserRemove(data as ScheduledEventUserData);
          break;
        case EVENTS.AUTO_MODERATION_RULE_CREATE:
          await this.autoModerationProcessor.processRuleCreate(data as AutoModerationRuleData);
          break;
        case EVENTS.AUTO_MODERATION_RULE_UPDATE:
          await this.autoModerationProcessor.processRuleUpdate(data as AutoModerationRuleData);
          break;
        case EVENTS.AUTO_MODERATION_RULE_DELETE:
          await this.autoModerationProcessor.processRuleDelete(data as AutoModerationRuleData);
          break;
        case EVENTS.AUTO_MODERATION_ACTION_EXECUTION:
          await this.autoModerationProcessor.processActionExecution(
            data as AutoModerationActionData
          );
          break;
      }

      this.emit('processed', event, data);
    } catch (error) {
      this.emit('error', error, event, data);
    }
  }
}
