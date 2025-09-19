import type { ActivityType } from "../../../enums";
import type { Library } from "../../conversion";
import type { Emoji } from "../emoji/emoji";

export type APIActivity = {
    name: string;
    type: ActivityType;
    url?: string | null;
    created_at: number;
    timestamps?: {
        start?: number;
        end?: number;
    }
    application_id?: string;
    status_display_type?: number | null;
    details?: string | null;
    details_url?: string | null;
    state?: string | null;
    state_url?: string | null;
    emoji?: Emoji | null;
    party?: {
        id?: string;
        size?: number[];
    };
    assets?: {
        large_image?: string;
        large_text?: string;
        large_url?: string;
        small_image?: string;
        small_text?: string;
        small_url?: string;
    };
    secrets?: {
        join?: string;
        spectate?: string;
        match?: string;
    };
    instance?: boolean;
    flags?: number;
    buttons?: Array<{
        label: string;
        url: string;
    }>
}

export type Activity = Library<APIActivity>;