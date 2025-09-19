import { IntegrationExpireBehavior, IntegrationType, Scope } from "../../../enums";
import { Library } from "../../conversion";
import { APIApplication } from "../application/application";
import { APIUser } from "../user/user";
import { APIIntegrationAccount } from "./integrationAccount";

export type APIIntegration = {
    id: string;
    name: string;
    type: IntegrationType;
    enabled: boolean;
    syncing?: boolean;
    role_id?: string;
    enable_emoticons?: string;
    expire_behavior?: IntegrationExpireBehavior;
    expire_grace_period?: number;
    user?: APIUser;
    account?: APIIntegrationAccount;
    synced_at?: Date;
    subscriber_count?: number;
    revoked?: boolean;
    application?: APIApplication;
    scopes?: Scope[];
}

export type Integration = Library<APIIntegration>;