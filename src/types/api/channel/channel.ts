import type { ChannelType, ForumLayoutType, SortOrderType, VideoQualityMode } from "../../../enums";
import type { Library } from "../../conversion";
import type { APIUser } from "../user/user";
import type { APIDefaultReaction } from "./defaultReaction";
import type { APIForumTag } from "./forumTag";
import type { APIOverwrite } from "./overwrite";
import type { APIThreadMember } from "./threadMember";
import type { APIThreadMetadata } from "./threadMetadata";
import type { APIVoiceRegion } from "./voiceRegion";

export type APIChannel = {
    id: string;
    type: ChannelType;
    guild_id?: string;
    position?: number;
    permission_overwrites?: APIOverwrite[];
    name?: string | null;
    topic?: string | null;
    nsfw?: boolean;
    last_message_id?: string | null;
    bitrate?: number;
    user_limit?: number;
    rate_limit_per_user?: number;
    recipients?: APIUser[];
    icon?: string | null;
    owner_id?: string;
    application_id?: string;
    managed?: boolean;
    parent_id?: string | null;
    last_pin_timestamp?: Date | null;
    rtc_region?: APIVoiceRegion | null;
    video_quality_mode?: VideoQualityMode;
    message_count?: number;
    thread_metadata?: APIThreadMetadata;
    member?: APIThreadMember;
    default_auto_archive_duration?: number;
    permissions?: string;
    flags?: number;
    total_messages_sent?: number;
    available_tags?: APIForumTag[];
    applied_tags?: string[];
    default_reaction_emoji?: APIDefaultReaction | null;
    default_thread_rate_limit_per_user?: number;
    default_sort_order?: SortOrderType | null;
    default_forum_layout?: ForumLayoutType;
}

export type Channel = Library<APIChannel>;