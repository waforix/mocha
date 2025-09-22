import { Member } from "../../../schemas";
import { APIGuildMember } from "../guild/guildMember";
import { APIUser, User } from "../user/user";

export type APIMention = APIUser & { member: Partial<APIGuildMember> };

export type Mention = User & { member: Partial<Member> };