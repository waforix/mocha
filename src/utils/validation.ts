export const isValidSnowflake = (id: unknown): id is string => {
  return typeof id === 'string' && /^\d{17,19}$/.test(id);
};

export const isValidGuildId = (guildId: unknown): guildId is string => {
  return isValidSnowflake(guildId);
};

export const isValidUserId = (userId: unknown): userId is string => {
  return isValidSnowflake(userId);
};

export const isValidChannelId = (channelId: unknown): channelId is string => {
  return isValidSnowflake(channelId);
};

export const isValidMessageId = (messageId: unknown): messageId is string => {
  return isValidSnowflake(messageId);
};

export const isValidTimestamp = (timestamp: unknown): timestamp is string => {
  if (typeof timestamp !== 'string') return false;
  const date = new Date(timestamp);
  return !Number.isNaN(date.getTime());
};

export const isValidUrl = (url: unknown): url is string => {
  if (typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidEmail = (email: unknown): email is string => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidHexColor = (color: unknown): color is string => {
  if (typeof color !== 'string') return false;
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

export const isValidDiscordToken = (token: unknown): token is string => {
  if (typeof token !== 'string') return false;
  return token.length >= 50 && /^[A-Za-z0-9._-]+$/.test(token);
};

export const isValidIntents = (intents: unknown): intents is number => {
  return typeof intents === 'number' && intents >= 0 && intents <= 0x7fffffff;
};

export const isValidChannelType = (type: unknown): type is number => {
  return typeof type === 'number' && type >= 0 && type <= 15;
};

export const isValidMessageType = (type: unknown): type is number => {
  return typeof type === 'number' && type >= 0 && type <= 24;
};

export const isValidPresenceStatus = (status: unknown): status is string => {
  return typeof status === 'string' && ['online', 'idle', 'dnd', 'offline'].includes(status);
};

export const isValidActivityType = (type: unknown): type is number => {
  return typeof type === 'number' && type >= 0 && type <= 5;
};

export const isValidPermissions = (permissions: unknown): permissions is string => {
  if (typeof permissions !== 'string') return false;
  return /^\d+$/.test(permissions);
};

export const isValidRolePosition = (position: unknown): position is number => {
  return typeof position === 'number' && position >= 0;
};

export const isValidEmojiId = (id: unknown): id is string => {
  return typeof id === 'string' && (/^\d{17,19}$/.test(id) || id.length <= 32);
};

export const isValidGuildFeature = (feature: unknown): feature is string => {
  const validFeatures = [
    'ANIMATED_BANNER',
    'ANIMATED_ICON',
    'APPLICATION_COMMAND_PERMISSIONS_V2',
    'AUTO_MODERATION',
    'BANNER',
    'COMMUNITY',
    'CREATOR_MONETIZABLE_PROVISIONAL',
    'CREATOR_STORE_PAGE',
    'DEVELOPER_SUPPORT_SERVER',
    'DISCOVERABLE',
    'FEATURABLE',
    'INVITES_DISABLED',
    'INVITE_SPLASH',
    'MEMBER_VERIFICATION_GATE_ENABLED',
    'MORE_STICKERS',
    'NEWS',
    'PARTNERED',
    'PREVIEW_ENABLED',
    'RAID_ALERTS_DISABLED',
    'ROLE_ICONS',
    'ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE',
    'ROLE_SUBSCRIPTIONS_ENABLED',
    'TICKETED_EVENTS_ENABLED',
    'VANITY_URL',
    'VERIFIED',
    'VIP_REGIONS',
    'WELCOME_SCREEN_ENABLED',
  ];
  return typeof feature === 'string' && validFeatures.includes(feature);
};

export const sanitizeString = (input: unknown, maxLength = 2000): string => {
  if (typeof input !== 'string') return '';
  return input.slice(0, maxLength).trim();
};

export const sanitizeNumber = (input: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number => {
  const num = Number(input);
  if (Number.isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
};

export const sanitizeArray = <T>(input: unknown, validator: (item: unknown) => item is T): T[] => {
  if (!Array.isArray(input)) return [];
  return input.filter(validator);
};

export const validateObject = <T>(
  input: unknown,
  validators: Record<keyof T, (value: unknown) => boolean>
): Partial<T> => {
  if (!input || typeof input !== 'object') return {};

  const result: Partial<T> = {};
  const obj = input as Record<string, unknown>;

  for (const [key, validator] of Object.entries(validators) as Array<
    [string, (value: unknown) => boolean]
  >) {
    const value = obj[key];
    if (validator(value)) {
      (result as Record<string, unknown>)[key] = value;
    }
  }

  return result;
};

export const createValidator = <T>(schema: Record<keyof T, (value: unknown) => boolean>) => {
  return (input: unknown): input is T => {
    if (!input || typeof input !== 'object') return false;

    const obj = input as Record<string, unknown>;
    return Object.entries(schema).every(([key, validator]) =>
      (validator as (value: unknown) => boolean)(obj[key])
    );
  };
};
