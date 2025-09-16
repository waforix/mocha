import {
    ChannelData,
    RoleData,
    InteractionData,
    InviteData,
    ScheduledEventData,
    ScheduledEventUserData,
    AutoModerationActionData,
    AutoModerationRuleData,
} from "../events";

import type { TLibrary } from "./conversion";

export type Channel = TLibrary<ChannelData>;
export type Role = TLibrary<RoleData>;
export type Interaction = TLibrary<InteractionData>;
export type Invite = TLibrary<InviteData>;
export type ScheduledEvent = TLibrary<ScheduledEventData>;
export type ScheduledEventUser = TLibrary<ScheduledEventUserData>;
export type AutoModerationAction = TLibrary<AutoModerationActionData>;
export type AutoModerationRule = TLibrary<AutoModerationRuleData>;
