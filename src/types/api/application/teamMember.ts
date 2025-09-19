import type { TeamMembershipState } from "../../../enums";
import type { Library } from "../../conversion";
import type { APIRole } from "../role/role";
import type { APIUser } from "../user/user";

export type APITeamMember = {
    membership_state: TeamMembershipState;
    team_id: string;
    user: Partial<APIUser>;
    role: APIRole;
}

export type TeamMember = Library<APITeamMember>;