import type { getDb } from '../db/index';
import { ChannelQueries } from './queries/channel';
import { MemberQueries } from './queries/member';
import { MessageQueries } from './queries/message';
import { UserQueries } from './queries/user';
import { VoiceQueries } from './queries/voice';

export class StatsQueries {
  public readonly message: MessageQueries;
  public readonly voice: VoiceQueries;
  public readonly user: UserQueries;
  public readonly channel: ChannelQueries;
  public readonly member: MemberQueries;

  constructor(db: ReturnType<typeof getDb>) {
    this.message = new MessageQueries(db);
    this.voice = new VoiceQueries(db);
    this.user = new UserQueries(db);
    this.channel = new ChannelQueries(db);
    this.member = new MemberQueries(db);
  }

  async getMessageStats(guildId: string, userId?: string, days = 30) {
    return this.message.getStats(guildId, userId, days);
  }

  async getVoiceStats(guildId: string, userId?: string, days = 30) {
    return this.voice.getStats(guildId, userId, days);
  }

  async getTopUsers(guildId: string, type: 'messages' | 'voice', limit = 10, days = 30) {
    return this.user.getTop(guildId, type, limit, days);
  }

  async getActivityTimeline(guildId: string, userId?: string, days = 7) {
    return this.message.getTimeline(guildId, userId, days);
  }

  async getChannelStats(guildId: string, days = 30) {
    return this.channel.getStats(guildId, days);
  }

  async getMemberGrowth(guildId: string, days = 30) {
    return this.member.getGrowth(guildId, days);
  }
}
