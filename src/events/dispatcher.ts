import { EventEmitter } from 'node:events';
import type { CommonDatabase } from '../db/index';
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
import { isValidSnowflake } from '../utils/validation';

export class EventDispatcher extends EventEmitter {
  private messageProcessor: MessageProcessor;
  private voiceProcessor: VoiceProcessor;
  private memberProcessor: MemberProcessor;
  private presenceProcessor: PresenceProcessor;
  private reactionProcessor: ReactionProcessor;
  private guildProcessor: GuildProcessor;

  constructor(db: CommonDatabase) {
    super();
    this.messageProcessor = new MessageProcessor(db);
    this.voiceProcessor = new VoiceProcessor(db);
    this.memberProcessor = new MemberProcessor(db);
    this.presenceProcessor = new PresenceProcessor(db);
    this.reactionProcessor = new ReactionProcessor(db);
    this.guildProcessor = new GuildProcessor(db);
  }

  async dispatch(event: string, data: unknown) {
    try {
      await this.processEvent(event, data);
      this.emit('processed', event, data);
    } catch (error) {
      this.emit('error', error, event, data);
    }
  }

  private async processEvent(event: string, data: unknown): Promise<void> {
    switch (event) {
      case EVENTS.MESSAGE_CREATE:
        return this.processMessage(data);
      case EVENTS.VOICE_STATE_UPDATE:
        return this.processVoiceState(data);
      case EVENTS.GUILD_MEMBER_ADD:
        return this.processMemberJoin(data);
      case EVENTS.GUILD_MEMBER_REMOVE:
        return this.processMemberLeave(data);
      case EVENTS.PRESENCE_UPDATE:
        return this.processPresence(data);
      case EVENTS.GUILD_CREATE:
        return this.processGuild(data);
      case EVENTS.MESSAGE_REACTION_ADD:
        return this.processReactionAdd(data);
      case EVENTS.MESSAGE_REACTION_REMOVE:
        return this.processReactionRemove(data);
    }
  }

  private async processMessage(data: unknown): Promise<void> {
    if (this.isValidMessage(data)) {
      await this.messageProcessor.process(data);
    }
  }

  private async processVoiceState(data: unknown): Promise<void> {
    if (this.isValidVoiceState(data)) {
      await this.voiceProcessor.process(data);
    }
  }

  private async processMemberJoin(data: unknown): Promise<void> {
    if (this.isValidMemberJoin(data)) {
      await this.memberProcessor.processJoin(data);
    }
  }

  private async processMemberLeave(data: unknown): Promise<void> {
    if (this.isValidMemberLeave(data)) {
      await this.memberProcessor.processLeave(data);
    }
  }

  private async processPresence(data: unknown): Promise<void> {
    if (this.isValidPresence(data)) {
      await this.presenceProcessor.process(data);
    }
  }

  private async processGuild(data: unknown): Promise<void> {
    if (this.isValidGuild(data)) {
      await this.guildProcessor.process(data);
    }
  }

  private async processReactionAdd(data: unknown): Promise<void> {
    if (this.isValidReaction(data)) {
      await this.reactionProcessor.processAdd(data);
    }
  }

  private async processReactionRemove(data: unknown): Promise<void> {
    if (this.isValidReaction(data)) {
      await this.reactionProcessor.processRemove(data);
    }
  }

  private isValidMessage(data: unknown): data is APIMessage {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Record<string, unknown>;
    return (
      typeof obj.id === 'string' &&
      isValidSnowflake(obj.id) &&
      typeof obj.channel_id === 'string' &&
      isValidSnowflake(obj.channel_id)
    );
  }

  private isValidVoiceState(data: unknown): data is APIVoiceState {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Record<string, unknown>;
    return (
      typeof obj.guild_id === 'string' &&
      isValidSnowflake(obj.guild_id) &&
      typeof obj.user_id === 'string' &&
      isValidSnowflake(obj.user_id)
    );
  }

  private isValidMemberJoin(
    data: unknown
  ): data is { guild_id: string; user: unknown; roles: string[]; joined_at: string } {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Record<string, unknown>;
    return (
      typeof obj.guild_id === 'string' &&
      isValidSnowflake(obj.guild_id) &&
      obj.user !== null &&
      typeof obj.user === 'object' &&
      Array.isArray(obj.roles) &&
      typeof obj.joined_at === 'string'
    );
  }

  private isValidMemberLeave(data: unknown): data is { guild_id: string; user: unknown } {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Record<string, unknown>;
    return (
      typeof obj.guild_id === 'string' &&
      isValidSnowflake(obj.guild_id) &&
      obj.user !== null &&
      typeof obj.user === 'object'
    );
  }

  private isValidPresence(data: unknown): data is APIPresenceUpdate {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Record<string, unknown>;
    return (
      typeof obj.guild_id === 'string' &&
      isValidSnowflake(obj.guild_id) &&
      obj.user !== null &&
      typeof obj.user === 'object'
    );
  }

  private isValidGuild(data: unknown): data is unknown {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Record<string, unknown>;
    return typeof obj.id === 'string' && isValidSnowflake(obj.id) && typeof obj.name === 'string';
  }

  private isValidReaction(data: unknown): data is {
    guild_id: string;
    channel_id: string;
    message_id: string;
    user_id: string;
    emoji: { id?: string; name: string; animated?: boolean };
  } {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Record<string, unknown>;
    return (
      typeof obj.guild_id === 'string' &&
      isValidSnowflake(obj.guild_id) &&
      typeof obj.channel_id === 'string' &&
      isValidSnowflake(obj.channel_id) &&
      typeof obj.message_id === 'string' &&
      isValidSnowflake(obj.message_id) &&
      typeof obj.user_id === 'string' &&
      isValidSnowflake(obj.user_id) &&
      obj.emoji !== null &&
      typeof obj.emoji === 'object' &&
      typeof (obj.emoji as Record<string, unknown>).name === 'string'
    );
  }
}

import type { Event } from '../enums';
import type { EventHandler } from '../types/eventHandler';

export class Dispatcher {
  private static instance: Dispatcher;
  private eventHandlers: Record<string, EventHandler[]>;

  public constructor() {
    this.eventHandlers = {};
  }

  public static getInstance(): Dispatcher {
    if (Dispatcher.instance === undefined) {
      Dispatcher.instance = new Dispatcher();
    }
    return Dispatcher.instance;
  }

  public async handle(event: Event, ...args: any): Promise<void> {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(async (eventHandler) => {
        await eventHandler(args);
      });
    }
  }

  public on(event: Event, callback: (...args: any) => Promise<void>) {
    if (this.eventHandlers[event] && this.eventHandlers[event].length > 0) {
      this.eventHandlers[event].push(callback);
    } else {
      this.eventHandlers[event] = [callback];
    }
  }
}
