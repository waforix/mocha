import { Library } from "../../conversion";

export type APIAutoModActionMetadata = {
    channel_id: string;
    duration_seconds: number;
    custom_message?: string;
}

export type AutoModActionMetadata = Library<APIAutoModActionMetadata>;