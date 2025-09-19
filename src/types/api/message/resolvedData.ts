import { Library } from "../../conversion";
import { APIChannel } from "../channel/channel";
import { APIGuildMember } from "../guild/guildMember";
import { APIRole } from "../role/role";
import { APIUser } from "../user/user";
import { APIAttachment } from "./attachment";
import { APIMessage } from "./message";

export type APIResolvedData = {
    users?: Map<string, APIUser>;
    members?: Map<string, Partial<APIGuildMember>>;
    roles?: Map<string, APIRole>;
    channels?: Map<string, Partial<APIChannel>>;
    messages?: Map<string, Partial<APIMessage>>;
    attachments?: Map<string, APIAttachment>;
}

export type ResolvedData = Library<APIResolvedData>;