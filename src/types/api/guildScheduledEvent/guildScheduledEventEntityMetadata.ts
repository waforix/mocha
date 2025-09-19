import type { Library } from '../../conversion';

export type APIGuildScheduledEventEntityMetadata = {
  location?: string;
};

export type GuildScheduledEventEntityMetadata = Library<APIGuildScheduledEventEntityMetadata>;
