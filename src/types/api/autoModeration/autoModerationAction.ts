import { ActionType } from "../../../enums";
import { Library } from "../../conversion";
import { APIActionMetadata } from "./actionMetadata";

export type APIAutoModerationAction = {
    type: ActionType;
    metadata?: APIActionMetadata;
}

export type AutoModerationAction = Library<APIAutoModerationAction>;