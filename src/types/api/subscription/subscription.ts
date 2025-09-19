import type { SubscriptionStatus } from '../../../enums';
import type { Library } from '../../conversion';

export type APISubscription = {
  id: string;
  user_id: string;
  sku_ids: string[];
  entitlement_ids: string[];
  renewal_sku_ids: string[] | null;
  current_period_start: Date;
  current_period_end: Date;
  status: SubscriptionStatus;
  canceled_at: Date | null;
  country?: string;
};

export type Subscription = Library<APISubscription>;
