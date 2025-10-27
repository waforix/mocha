import * as postgresSchema from '../generated/postgres/schema';
import * as sqliteSchema from '../generated/sqlite/schema';

// Start with sqlite as default
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
let schema: any = sqliteSchema;

export function setSchemaType(type: 'postgres' | 'sqlite' | 'mysql'): void {
  schema = type === 'postgres' ? postgresSchema : sqliteSchema;

  // Update all exported tables
  guildTable = schema.guildTable;
  channelTable = schema.channelTable;
  userTable = schema.userTable;
  memberTable = schema.memberTable;
  messageeventTable = schema.messageeventTable;
  voiceeventTable = schema.voiceeventTable;
  membereventTable = schema.membereventTable;
  presenceeventTable = schema.presenceeventTable;
  reactioneventTable = schema.reactioneventTable;

  // Update aliases
  guilds = guildTable;
  channels = channelTable;
  users = userTable;
  members = memberTable;
  messageEvents = messageeventTable;
  voiceEvents = voiceeventTable;
  memberEvents = membereventTable;
  presenceEvents = presenceeventTable;
  reactionEvents = reactioneventTable;
}

// Re-export all tables from the current schema
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let guildTable: any = schema.guildTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let channelTable: any = schema.channelTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let userTable: any = schema.userTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let memberTable: any = schema.memberTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let messageeventTable: any = schema.messageeventTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let voiceeventTable: any = schema.voiceeventTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let membereventTable: any = schema.membereventTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let presenceeventTable: any = schema.presenceeventTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let reactioneventTable: any = schema.reactioneventTable;

// Aliases
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let guilds: any = guildTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let channels: any = channelTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let users: any = userTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let members: any = memberTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let messageEvents: any = messageeventTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let voiceEvents: any = voiceeventTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let memberEvents: any = membereventTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let presenceEvents: any = presenceeventTable;
// biome-ignore lint/suspicious/noExplicitAny: Dynamic schema switching requires any type
export let reactionEvents: any = reactioneventTable;
