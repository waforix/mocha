import type { ActionType } from "../../../enums";
import type { Library } from "../../conversion";
import type { APIActionMetadata } from "./actionMetadata";

export type APIAutoModerationAction = {
    type: ActionType;
    metadata?: APIActionMetadata;
}

export type AutoModerationAction = Library<APIAutoModerationAction>;