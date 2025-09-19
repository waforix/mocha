import type { Library } from "../../conversion";
import type { APIGuildMember } from "../guild/guildMember";

export type APIVoiceState = {
    guild_id?: string;
    channel_id: string | null;
    user_id: string;
    member?: APIGuildMember;
    session_id: string;
    deaf: boolean;
    mute: boolean;
    self_deaf: boolean;
    self_mute: boolean;
    self_stream?: boolean;
    self_video: boolean;
    suppress: boolean;
    request_to_speak_timestamp: Date | null;
}

export type VoiceState = Library<APIVoiceState>;