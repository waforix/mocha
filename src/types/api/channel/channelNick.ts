import type { Library } from '../../conversion';

export type APIChannelNick = {
  id: string;
  nick: string;
};

export type ChannelNick = Library<APIChannelNick>;
