import { Library } from "../../conversion";

export type APIActionMetadata = {
    channel_id: string;
    duration_seconds: number;
    custom_message?: string;
}

export type ActionMetadata = Library<APIActionMetadata>;