/**
 * Database module with Prisma integration
 * @category Database
 */

export type { PrismaClient } from '@prisma/client';
export { disconnect, getInstance, isConnected, reset } from './client';
export {
  countGuilds,
  countMessageEventsByGuild,
  countUsers,
  createMemberEvent,
  createMessageEvent,
  createPresenceEvent,
  createReactionEvent,
  createVoiceEvent,
  deleteGuild,
  deleteUser,
  findAllGuilds,
  findAllUsers,
  findGuildById,
  findMessageEventsByGuildAndDateRange,
  findUserById,
  findUsersByUsername,
  findVoiceEventsByGuildAndDateRange,
  upsertGuild,
  upsertUser,
} from './repositories';
