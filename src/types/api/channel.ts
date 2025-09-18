import { ChannelType, ForumLayoutType, ForumTagName, OverwriteType, SortOrderType, VideoQualityMode } from "../../enums";
import { Library } from "../conversion";
import { APIUser } from "./user";

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

export type APIOverwrite = {
    id: string;
    type: OverwriteType;
    allow: string;
    deny: string;
}

export type APIVoiceRegion = {
    id: string;
    name: string;
    optimal: boolean;
    deprecated: boolean;
    custom: boolean;
}

export type APIThreadMetadata = {
    archived: boolean;
    auto_archive_duration: number;
    archive_timestamp: Date;
    locked: boolean;
    invitable?: boolean;
    create_timestamp?: Date | null;
}

export type APIThreadMember = {
    id?: string;
    user_id?: string;
    join_timestamp: Date;
    flags: number;
    member?: APIGuildMember;
}

export type APIForumTag = {
    id: string;
    name: ForumTagName;
    moderated: boolean;
    emoji_id: string | null;
    emoji_name: string | null;
}

export type APIDefaultReaction = {
    emoji_id: string | null;
    emoji_name: string | null;
}

export type Channel = Library<APIChannel>;
export type Overwrite = Library<APIOverwrite>;
export type VoiceRegion = Library<APIVoiceRegion>;
export type ThreadMetadata = Library<APIThreadMetadata>;
export type ThreadMember = Library<APIThreadMember>;
export type ForumTag = Library<APIForumTag>;
export type DefaultReaction = Library<APIDefaultReaction>;
