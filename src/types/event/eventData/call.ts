import { Call, Channel } from "../../api";
import { EventData } from "./eventData";

export type CallCreate = EventData<Call>;
export type CallUpdate = EventData<Omit<Call, "voiceStates">>;
export type CallDelete = EventData<Omit<Call, "messageId" | "region" | "ringing" | "voiceStates"> & { unavailable?: boolean }>;

export type ChannelCreate = EventData<Channel & {origin_channel_id?: string}>;
export type ChannelUpdate = EventData<Channel>;
export type ChannelDelete = EventData<Partial<Channel>>;

