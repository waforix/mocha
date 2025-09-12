export declare const GATEWAY_URL = "wss://gateway.discord.gg/?v=10&encoding=json";
export declare const OPCODES: {
    readonly DISPATCH: 0;
    readonly HEARTBEAT: 1;
    readonly IDENTIFY: 2;
    readonly PRESENCE_UPDATE: 3;
    readonly VOICE_STATE_UPDATE: 4;
    readonly RESUME: 6;
    readonly RECONNECT: 7;
    readonly REQUEST_GUILD_MEMBERS: 8;
    readonly INVALID_SESSION: 9;
    readonly HELLO: 10;
    readonly HEARTBEAT_ACK: 11;
};
export declare const INTENTS: {
    readonly GUILDS: number;
    readonly GUILD_MEMBERS: number;
    readonly GUILD_MESSAGES: number;
    readonly GUILD_MESSAGE_REACTIONS: number;
    readonly GUILD_VOICE_STATES: number;
    readonly GUILD_PRESENCES: number;
};
export declare const EVENTS: {
    readonly READY: "READY";
    readonly GUILD_CREATE: "GUILD_CREATE";
    readonly GUILD_DELETE: "GUILD_DELETE";
    readonly GUILD_MEMBER_ADD: "GUILD_MEMBER_ADD";
    readonly GUILD_MEMBER_REMOVE: "GUILD_MEMBER_REMOVE";
    readonly MESSAGE_CREATE: "MESSAGE_CREATE";
    readonly MESSAGE_DELETE: "MESSAGE_DELETE";
    readonly VOICE_STATE_UPDATE: "VOICE_STATE_UPDATE";
    readonly PRESENCE_UPDATE: "PRESENCE_UPDATE";
};
