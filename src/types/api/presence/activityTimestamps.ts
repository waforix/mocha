import { Library } from "../../conversion";

export type APIActivityTimestamps = {
    start?: string;
    end?: string;
}

export type ActivityTimestamps = Library<APIActivityTimestamps>;