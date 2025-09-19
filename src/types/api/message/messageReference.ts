import type { MessageReferenceType } from "../../../enums";
import type { Library } from "../../conversion";

export type APIMessageReference = {
    type?: MessageReferenceType;
    message_id?: string;
    channel_id?: string;
    guild_id?: string;
    fail_if_not_exists?: boolean;
}

export type MessageReference = Library<APIMessageReference>;