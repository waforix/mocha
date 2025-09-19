import { TeamMembershipState } from "../../../enums";
import { Library } from "../../conversion";
import { APIRole } from "../role/role";
import { APIUser } from "../user/user";

export type APITeamMember = {
    membership_state: TeamMembershipState;
    team_id: string;
    user: Partial<APIUser>;
    role: APIRole;
}

export type TeamMember = Library<APITeamMember>;