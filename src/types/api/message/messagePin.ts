import { Library } from "../../conversion";
import { APIMessage } from "./message";

export type APIMessagePin = {
    pinned_at: Date;
    message: APIMessage;
}

export type MessagePin = Library<APIMessagePin>;