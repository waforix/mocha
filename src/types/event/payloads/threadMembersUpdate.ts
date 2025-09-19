import type { ThreadMember } from "../../api";

export type ThreadMembersUpdate = {
    id: string;
    guild_id: string;
    member_count: number;
    added_members?: ThreadMember[];
    removed_members_ids?: string[];
}