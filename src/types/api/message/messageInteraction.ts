import { InteractionType } from "../../../enums";
import { Library } from "../../conversion";
import { APIGuildMember } from "../guild/guildMember";
import { APIUser } from "../user/user";

export type APIMessageInteraction = {
    id: string;
    type: InteractionType;
    name: string;
    user: Partial<APIUser>;
    member: Partial<APIGuildMember>;
}

export type MessageInteraction = Library<APIMessageInteraction>;