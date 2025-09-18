import {
  guildTable,
  channelTable,
  userTable,
  memberTable,
  messageeventTable,
  voiceeventTable,
  membereventTable,
  presenceeventTable,
  reactioneventTable
} from '../generated/sqlite/schema';

export {
  guildTable,
  channelTable,
  userTable,
  memberTable,
  messageeventTable,
  voiceeventTable,
  membereventTable,
  presenceeventTable,
  reactioneventTable
};

export const guilds = guildTable;
export const channels = channelTable;
export const users = userTable;
export const members = memberTable;
export const messageEvents = messageeventTable;
export const voiceEvents = voiceeventTable;
export const memberEvents = membereventTable;
export const presenceEvents = presenceeventTable;
export const reactionEvents = reactioneventTable;
