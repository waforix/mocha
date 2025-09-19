import type { Library } from "../../conversion";
import type { APIChannel } from "../channel/channel";
import type { APIGuildMember } from "../guild/guildMember";
import type { APIRole } from "../role/role";
import type { APIUser } from "../user/user";
import type { APIAttachment } from "./attachment";
import type { APIMessage } from "./message";

export type APIResolvedData = {
    users?: Map<string, APIUser>;
    members?: Map<string, Partial<APIGuildMember>>;
    roles?: Map<string, APIRole>;
    channels?: Map<string, Partial<APIChannel>>;
    messages?: Map<string, Partial<APIMessage>>;
    attachments?: Map<string, APIAttachment>;
}

export type ResolvedData = Library<APIResolvedData>;