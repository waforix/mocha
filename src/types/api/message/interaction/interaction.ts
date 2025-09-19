import { ApplicationIntegrationType, InteractionContextType, InteractionType, Locale } from "../../../enums";
import { Library } from "../../conversion";
import { APIChannel } from "../channel/channel";
import { APIEntitlement } from "../entitlement/entitlement";
import { APIGuild } from "../guild/guild";
import { APIGuildMember } from "../guild/guildMember";
import { APIUser } from "../user/user";
import { APIApplicationCommandData } from "./applicationCommandData";
import { AuthorizingIntegrationOwner } from "./authorizingIntegrationOwner";
import { APIMessage } from "./message";

export type APIInteraction = {
    id: string;
    application_id: string;
    type: InteractionType;
    data?: APIApplicationCommandData;
    guild?: Partial<APIGuild>;
    guild_id?: string;
    channel?: Partial<APIChannel>;
    channel_id?: string;
    member?: APIGuildMember;
    user?: APIUser;
    token: string;
    version: number;
    message?: APIMessage;
    app_permissions: string;
    locale?: Locale;
    guild_locale?: string;
    entitlements: APIEntitlement[];
    authorization_integration_owners: Record<ApplicationIntegrationType, AuthorizingIntegrationOwner<ApplicationIntegrationType, InteractionContextType>>;
    context?: InteractionContextType;
    attachment_size_limit: number;
}

export type Interaction = Library<APIInteraction>;