import { EntitlementType } from "../../../enums";
import { Library } from "../../conversion";

export type APIEntitlement = {
    id: string;
    sku_id: string;
    application_id: string;
    user_id?: string;
    type: EntitlementType;
    deleted: boolean;
    starts_at: Date | null;
    ends_at: Date | null;
    guild_id?: string;
    consumed?: boolean;
}

export type Entitlement = Library<APIEntitlement>;