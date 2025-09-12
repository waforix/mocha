export interface BaseEvent {
  id: string;
  guildId: string;
  timestamp: Date;
  type: string;
}

export interface MessageEvent extends BaseEvent {
  userId: string;
  channelId: string;
  content: string;
  attachmentCount: number;
  embedCount: number;
}

export interface VoiceEvent extends BaseEvent {
  userId: string;
  channelId?: string;
  action: 'join' | 'leave' | 'move';
  duration?: number;
}

export interface MemberEvent extends BaseEvent {
  userId: string;
  action: 'join' | 'leave';
  roles?: string[];
}

export interface PresenceEvent extends BaseEvent {
  userId: string;
  status: string;
  activity?: string;
  activityType?: number;
}

export type StatsEvent = MessageEvent | VoiceEvent | MemberEvent | PresenceEvent;
