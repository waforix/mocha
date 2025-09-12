export const FATAL_CLOSE_CODES = new Set([
    4004, // Authentication failed
    4010, // Invalid shard
    4011, // Sharding required
    4012, // Invalid API version
    4013, // Invalid intents
    4014, // Disallowed intents
]);
export const isFatalCloseCode = (code) => FATAL_CLOSE_CODES.has(code);
