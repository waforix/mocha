import { Status } from "../../../enums";
import { APIUser } from "../user/user"

export type APIPresence = {
    user: Partial<APIUser>;
    guild_id?: string;
    status: Status;
    activities: 
}