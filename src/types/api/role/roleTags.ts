import type { Library } from '../../conversion';

export type APIRoleTags = {
  bot_id?: string;
  integration_id?: string;
  premium_subscriber?: null;
  subscription_listing_id?: string;
  available_for_purchase?: null;
  guild_connections?: null;
};

export type RoleTags = Library<APIRoleTags>;
