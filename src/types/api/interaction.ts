import { ApplicationCommandOptionType, ApplicationCommandType, ApplicationIntegrationType, ComponentType, InteractionContextType, InteractionType, Locale } from "../../enums";
import { APIAttachment } from "./attachment";
import { APIChannel } from "./channel";
import { APIGuildMember } from "./guildMember";
import { APIMessage } from "./message";
import { APIRole } from "./role";
import { APIUser } from "./user";

type APIAuthorizingIntegrationOwner<
    T extends ApplicationIntegrationType,
    U extends InteractionContextType> =
    T extends ApplicationIntegrationType.GUILD_INSTALL ?
        U extends InteractionContextType.GUILD ? string : 0 : string;

export type APIModalSubmitInteractionMetadata = {
    id: string;
    type: InteractionType;
    user: APIUser;
    authorizing_integration_owners: 
}

export type Interaction = {
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
    authorization_integration_owners: Record<ApplicationIntegrationType, APIAuthorizingIntegrationOwner<ApplicationIntegrationType, InteractionContextType>>;
    context?: InteractionContextType;
    attachment_size_limit: number;
}

export type APIApplicationCommandData = {
    id: string;
    name: string;
    type: ApplicationCommandType;
    resolved_data: APIResolvedData;
    options?: APIApplicationCommandInteractionDataOption[];
    guild_id?: string;
    target_id?: string;
}

export type APIResolvedData = {
    users?: Map<string, APIUser>;
    members?: Map<string, Partial<APIGuildMember>>;
    roles?: Map<string, APIRole>;
    channels?: Map<string, Partial<APIChannel>>;
    messages?: Map<string, Partial<APIMessage>>;
    attachments?: Map<string, APIAttachment>;
}

export type APIApplicationCommandInteractionDataOption = {
    name: string;
    type: ApplicationCommandOptionType;
    value?: string | number | boolean;
    options?: APIApplicationCommandInteractionDataOption[];
    focused?: boolean;
}

export type APIMessageComponentData = {
    custom_id: string;
    component_type: ComponentType;
    values?: string;
    resolved?: APIResolvedData;
}

export type APIModalSubmitData = {
    custom_id: string;
    components: 
}

type APIStringSelectInteractionResponse = {
    type: ComponentType.STRING_SELECT;
    component_type: ComponentType.STRING_SELECT;
    id: number;
    custom_id: string;
    values: string[];
}

type APITextInputResponse = {
    type: ComponentType.TEXT_INPUT;
    id: number;
    custom_id: string;
    value: string;
}

type APIMentionableBaseInteractionResponse<
    T extends ComponentType.USER_SELECT |
    ComponentType.ROLE_SELECT |
    ComponentType.MENTIONABLE_SELECT |
    ComponentType.CHANNEL_SELECT> =
{
    type: T;
    component_type: T;
    id: number;
    custom_id: string;
    resolved: APIResolvedData;
    values: string[];
}

export type APIUserSelectInteractionResponse = APIMentionableBaseInteractionResponse<ComponentType.USER_SELECT>;
export type APIRoleSelectInteractionResponse = APIMentionableBaseInteractionResponse<ComponentType.ROLE_SELECT>;
export type APIMentionableSelectInteractionResponse = APIMentionableBaseInteractionResponse<ComponentType.MENTIONABLE_SELECT>;
export type APIChannelSelectInteractionResponse = APIMentionableBaseInteractionResponse<ComponentType.CHANNEL_SELECT>;

export type APIInteractionResponse<T extends ComponentType> =
    T extends ComponentType.STRING_SELECT ? APIStringSelectInteractionResponse :
    T extends ComponentType.TEXT_INPUT ? APITextInputResponse :
    T extends ComponentType.USER_SELECT ? APIUserSelectInteractionResponse :
    T extends ComponentType.ROLE_SELECT ? APIRoleSelectInteractionResponse :
    T extends ComponentType.MENTIONABLE_SELECT ? APIMentionableSelectInteractionResponse :
    T extends ComponentType.CHANNEL_SELECT ? APIChannelSelectInteractionResponse :
    never;