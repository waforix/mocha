import { InteractionCallbackType } from "../../../enums"
import { Library } from "../../conversion";
import { APIMessage } from "./message";

export type APIInteractionCallbackResource = {
    type: InteractionCallbackType;
    activity_instance?: undefined; // not used in this library
    message?: APIMessage;
}

export type InteractionCallbackResource = Library<APIInteractionCallbackResource>;