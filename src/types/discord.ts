// Discord API types - these match Discord's API structure exactly with snake_case fields
export interface APIGatewayPayload {
  op: number;
  d: unknown;
  s?: number;
  t?: string;
}

export interface APIGuildMember {
  user?: APIUser;
  nick?: string;
  roles: string[];
  joined_at: string;
  premium_since?: string;
}

export interface APIUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  bot?: boolean;
}

export interface APIGuild {
  id: string;
  name: string;
  icon?: string;
  owner_id: string;
  member_count?: number;
}

export interface APIChannel {
  id: string;
  type: number;
  guild_id?: string;
  name?: string;
  parent_id?: string;
}

export interface APIMessage {
  id: string;
  channel_id: string;
  guild_id?: string;
  author: APIUser;
  content: string;
  timestamp: string;
  edited_timestamp?: string;
  attachments: unknown[];
  embeds: unknown[];
  type?: number;
  thread?: {
    id: string;
    parent_id?: string;
  };
}

export interface APIVoiceState {
  guild_id?: string;
  channel_id?: string;
  user_id: string;
  session_id: string;
  deaf: boolean;
  mute: boolean;
  self_deaf: boolean;
  self_mute: boolean;
}

export interface APIPresenceUpdate {
  user: Partial<APIUser>;
  guild_id: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: APIActivity[];
}

export interface APIActivity {
  name: string;
  type: number;
  url?: string;
  created_at: number;
  timestamps?: {
    start?: number;
    end?: number;
  };
}

// Library types - clean camelCase versions for internal use
export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  bot?: boolean;
}

export interface Guild {
  id: string;
  name: string;
  icon?: string;
  ownerId: string;
  memberCount?: number;
}

export interface Channel {
  id: string;
  type: number;
  guildId?: string;
  name?: string;
  parentId?: string;
}

export interface Message {
  id: string;
  channelId: string;
  guildId?: string;
  author: User;
  content: string;
  timestamp: Date;
  editedTimestamp?: Date;
  attachmentCount: number;
  embedCount: number;
}

// Transformation functions
export function apiUserToUser(apiUser: APIUser): User {
  return {
    id: apiUser.id,
    username: apiUser.username,
    discriminator: apiUser.discriminator,
    avatar: apiUser.avatar,
    bot: apiUser.bot,
  };
}

export function apiGuildToGuild(apiGuild: APIGuild): Guild {
  return {
    id: apiGuild.id,
    name: apiGuild.name,
    icon: apiGuild.icon,
    ownerId: apiGuild.owner_id,
    memberCount: apiGuild.member_count,
  };
}

export function apiChannelToChannel(apiChannel: APIChannel): Channel {
  return {
    id: apiChannel.id,
    type: apiChannel.type,
    guildId: apiChannel.guild_id,
    name: apiChannel.name,
    parentId: apiChannel.parent_id,
  };
}

export function apiMessageToMessage(apiMessage: APIMessage): Message {
  return {
    id: apiMessage.id,
    channelId: apiMessage.channel_id,
    guildId: apiMessage.guild_id,
    author: apiUserToUser(apiMessage.author),
    content: apiMessage.content,
    timestamp: new Date(apiMessage.timestamp),
    editedTimestamp: apiMessage.edited_timestamp
      ? new Date(apiMessage.edited_timestamp)
      : undefined,
    attachmentCount: apiMessage.attachments.length,
    embedCount: apiMessage.embeds.length,
  };
}
