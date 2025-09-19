import type { ApplicationEventWebhookStatus, ApplicationFlag, ApplicationIntegrationType, WebhookType } from "../../../enums";
import type { Library } from "../../conversion";
import type { APIGuild } from "../guild/guild";
import type { APIUser } from "../user/user";
import type { APIInstallParams } from "./installParams";
import type { APITeam } from "./team";

export type APIApplication = {
    id: string;
    name: string;
    icon: string | null;
    description: string;
    rpc_origins?: string[];
    bot_public: boolean;
    bot_require_code_grant: boolean;
    bot?: Partial<APIUser>;
    terms_of_service_url?: string;
    privacy_policy_url?: string;
    owner?: Partial<APIUser>;
    verify_key: string;
    team: APITeam;
    guild_id?: string;
    guild?: Partial<APIGuild>;
    primary_sku_id?: string;
    slug?: string;
    cover_image?: string;
    flags?: ApplicationFlag;
    approximate_guild_count?: number;
    approximate_user_install_count?: number;
    approximate_user_authorization_count?: number;
    redirect_uris?: string[];
    interactions_endpoint_url?: string | null;
    role_connections_verification?: string | null;
    event_webhooks_url?: string | null;
    event_webhooks_status: ApplicationEventWebhookStatus;
    event_webhooks_types?: WebhookType[];
    tags?: string[];
    install_params?: APIInstallParams;
    integration_types_config?: Record<ApplicationIntegrationType, APIInstallParams>;
}

export type Application = Library<APIApplication>;