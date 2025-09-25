import { Library } from "../../conversion";

export type APIAutoModIncidentsData = {
    raid_detected_at: Date | null;
    dm_spam_detected_at: Date | null;
    invites_disabled_until: Date | null;
    dms_disabled_until: Date | null;
}

export type AutoModIncidentsData = Library<APIAutoModIncidentsData>;