import type { ChannelType } from '../../../enums';

export type ThreadDelete = {
  id: string;
  guild_id: string;
  parent_id: string;
  type: ChannelType;
};
