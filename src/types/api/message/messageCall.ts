import type { Library } from "../../conversion";

export type APIMessageCall = {
    participants: string[];
    ended_timestamp?: Date | null;
}

export type MessageCall = Library<APIMessageCall>;