import { ChannelQueries } from './queries/channel';
import { MemberQueries } from './queries/member';
import { MessageQueries } from './queries/message';
import { UserQueries } from './queries/user';
import { VoiceQueries } from './queries/voice';
export class StatsQueries {
    message;
    voice;
    user;
    channel;
    member;
    constructor(db) {
        this.message = new MessageQueries(db);
        this.voice = new VoiceQueries(db);
        this.user = new UserQueries(db);
        this.channel = new ChannelQueries(db);
        this.member = new MemberQueries(db);
    }
    async getMessageStats(guildId, userId, days = 30) {
        return this.message.getStats(guildId, userId, days);
    }
    async getVoiceStats(guildId, userId, days = 30) {
        return this.voice.getStats(guildId, userId, days);
    }
    async getTopUsers(guildId, type, limit = 10, days = 30) {
        return this.user.getTop(guildId, type, limit, days);
    }
    async getActivityTimeline(guildId, userId, days = 7) {
        return this.message.getTimeline(guildId, userId, days);
    }
    async getChannelStats(guildId, days = 30) {
        return this.channel.getStats(guildId, days);
    }
    async getMemberGrowth(guildId, days = 30) {
        return this.member.getGrowth(guildId, days);
    }
}
