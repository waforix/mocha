import { ApplicationIntegrationType, InteractionContextType } from "../../../enums";

export type AuthorizingIntegrationOwner<
    T extends ApplicationIntegrationType,
    U extends InteractionContextType> =
    T extends ApplicationIntegrationType.GUILD_INSTALL ?
        U extends InteractionContextType.GUILD ? string : 0 : string;