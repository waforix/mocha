import { Entitlement, GuildMember, Interaction, Subscription, User } from "../api";
import { Presence } from "../api/presence";

export type Event<T> = T;

export type EntitlementCreate = Event<Entitlement>;

export type EntitlementUpdate = Event<Entitlement & { endsAt: Date }>;

export type EntitlementDelete = Event<Entitlement>;

export type GuildMembersChunk = Event<{
    guildId: string;
    members: GuildMember[];
    chunkIndex: number;
    chunkCount: number;
    notFound?: number[];
    presences: Presence[];
    nonce?: string;
}>;

export type InteractionCreate = Event<Interaction>;

export type SubscriptionCreate = Event<Subscription>;

export type SubscriptionUpdate = Event<Subscription>;

export type SubscriptionDelete = Event<Subscription>;

export type UserUpdate = Event<User>;

export type VoiceServerUpdate = Event<{ token: string; guildId: string; endpoint: string }>;