import { Library } from "../../conversion";
import { APITeamMember } from "./teamMember";

export type APITeam = {
    icon: string | null;
    id: string;
    members: APITeamMember[];
    name: string;
    owner_user_id: string;
}

export type Team = Library<APITeam>;