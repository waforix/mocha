import { Library } from "../../conversion";

export type APIRoleSubscriptionData = {
    role_subscription_listing_id: string;
    tier_name: string;
    total_months_subscribed: number;
    is_renewal: boolean;
}

export type RoleSubscriptionData = Library<APIRoleSubscriptionData>;