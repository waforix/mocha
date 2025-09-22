import { ClientStatus, Status } from "../../../enums";
import { Library } from "../../conversion";
import { Activity } from "../user/activity";
import { User } from "../user/user";

export type APIPresence = {
    user: Partial<User>;
    guild_id: string;
    status: Status;
    activities: Activity[];
    hidden_activities?: Activity[];
    client_status: ClientStatus;
    has_played_game?: boolean;
}

export type Presence = Library<APIPresence>;