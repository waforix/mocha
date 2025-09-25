import { StatusType } from "../../../enums/presence";
import { Library } from "../../conversion";
import { APIUser } from "../user/user"
import { APIActivity } from "./activity";
import { APIClientStatus } from "./clientStatus";

export type APIPresence = {
    user: Partial<APIUser>;
    guild_id?: string;
    status: StatusType;
    activities: APIActivity[];
    hidden_activities: APIActivity[];
    client_status: APIClientStatus;
    has_played_game?: boolean;
}

export type Presence = Library<APIPresence>;