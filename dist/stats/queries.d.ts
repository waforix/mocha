import type { getDb } from '../db/index';
import { ChannelQueries } from './queries/channel';
import { MemberQueries } from './queries/member';
import { MessageQueries } from './queries/message';
import { UserQueries } from './queries/user';
import { VoiceQueries } from './queries/voice';
export declare class StatsQueries {
    readonly message: MessageQueries;
    readonly voice: VoiceQueries;
    readonly user: UserQueries;
    readonly channel: ChannelQueries;
    readonly member: MemberQueries;
    constructor(db: ReturnType<typeof getDb>);
    getMessageStats(guildId: string, userId?: string, days?: number): Promise<{
        count: number;
        attachments: string | null;
        embeds: string | null;
    }[]>;
    getVoiceStats(guildId: string, userId?: string, days?: number): Promise<{
        totalTime: string | null;
        sessions: number;
    }>;
    getTopUsers(guildId: string, type: 'messages' | 'voice', limit?: number, days?: number): Promise<{
        userId: string;
        username: string;
        count: number;
    }[] | {
        userId: string;
        username: string;
        totalTime: string | null;
    }[]>;
    getActivityTimeline(guildId: string, userId?: string, days?: number): Promise<{
        hour: number;
        count: number;
    }[]>;
    getChannelStats(guildId: string, days?: number): Promise<{
        channelId: string;
        channelName: string | null;
        messageCount: number;
        uniqueUsers: number;
    }[]>;
    getMemberGrowth(guildId: string, days?: number): Promise<{
        joins: {
            date: string;
            joins: number;
        }[];
        leaves: {
            date: string;
            leaves: number;
        }[];
    }>;
}
