import type { InteractionCallbackType } from "../../../../enums"
import type { Library } from "../../../conversion";
import type { APIMessage } from "../message";

export type APIInteractionCallbackResource = {
    type: InteractionCallbackType;
    activity_instance?: undefined; // not used in this library
    message?: APIMessage;
}

export type InteractionCallbackResource = Library<APIInteractionCallbackResource>;