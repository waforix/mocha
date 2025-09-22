import type { Library } from '../../conversion';
import type { APIChannelStatus } from './channelStatus';

export type APIChannelStatuses = {
  guild_id: string;
  channels: APIChannelStatus[];
};

export type ChannelStatuses = Library<APIChannelStatuses>;
