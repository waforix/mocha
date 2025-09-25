import { StatusType } from "../../enums/presence";
import { Activity } from "../api";
import { Event } from "./event";

export type PresenceUpdate = Event<{
    since?: number | null;
    activities?: Activity[];
    status?: StatusType;
    afk?: boolean;
}>;