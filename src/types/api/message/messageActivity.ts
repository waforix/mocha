import type { MessageActivityType } from "../../../enums";
import type { Library } from "../../conversion";

export type APIMessageActivity = {
    type: MessageActivityType;
    party_id: string;
}

export type MessageActivity = Library<APIMessageActivity>;