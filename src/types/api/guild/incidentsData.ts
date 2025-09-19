import type { Library } from "../../conversion";

export type APIIncidentsData = {
    invites_disabled_until: Date | null;
    dms_disabled_until: Date | null;
    dm_spam_detected_at?: Date | null;
    raid_detected_at?: Date | null;
}

export type IncidentsData = Library<APIIncidentsData>;