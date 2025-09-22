import type { Library } from '../../conversion';

export type APIChannelStatus = {
  id: string;
  status: string;
};

export type ChannelStatus = Library<APIChannelStatus>;
