import type { InteractionType } from "../../../../enums";
import type { Library } from "../../../conversion";

export type APIInteractionCallback = {
    id: string;
    type: InteractionType;
    activity_instance_id?: string;
    response_message_id?: string;
    response_message_loading?: boolean;
    response_message_ephemeral?: boolean;
}

export type InteractionCallback = Library<APIInteractionCallback>;