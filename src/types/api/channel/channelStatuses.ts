import { Library } from "../../conversion";
import { APIChannelStatus } from "./channelStatus";

export type APIChannelStatuses = {
    guild_id: string;
    channels: APIChannelStatus[];
}

export type ChannelStatuses = Library<APIChannelStatuses>;