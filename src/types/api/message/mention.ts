import type { Member } from "../../../schemas";
import type { APIGuildMember } from "../guild/guildMember";
import type { APIUser, User } from "../user/user";

export type APIMention = APIUser & { member: Partial<APIGuildMember> };

export type Mention = User & { member: Partial<Member> };