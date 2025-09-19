import { MessageActivityType } from "../../../enums";
import { Library } from "../../conversion";

export type APIMessageActivity = {
    type: MessageActivityType;
    party_id: string;
}

export type MessageActivity = Library<APIMessageActivity>;