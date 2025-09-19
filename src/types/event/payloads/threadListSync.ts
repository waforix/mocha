import type { Channel, ThreadMember } from "../../api";

export type ThreadListSync = {
    guild_id: string;
    channel_ids?: string[];
    threads: Channel[];
    members: ThreadMember[];
}