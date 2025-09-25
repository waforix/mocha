import { ActivityType } from "../../../enums/presence";
import { Library } from "../../conversion";
import { APIActivityTimestamps } from "./activityTimestamps";

export type APIActivity = {
    id: string;
    name: string;
    type: ActivityType;
    url?: string | null;
    created_at: number;
    session_id?: string;
    platform?: string;
    supported_platforms?: string[];
    timestamps?: APIActivityTimestamps;
}

export type Activity = Library<APIActivity>;