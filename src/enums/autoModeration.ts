export enum TriggerType {
    KEYWORD = 1,
    SPAM = 3,
    KEYWORD_PRESET = 4,
    MENTION_SPAM = 5,
    MEMBER_PROFILE = 6
}

export enum KeywordPresetType {
    PROFANITY = 1,
    SEXUAL_CONTENT = 2,
    SLURS = 3
}

export enum EventType {
    MESSAGE_SEND = 1,
    MEMBER_UPDATE = 2
}

export enum ActionType {
    BLOCK_MESSAGE = 1,
    SEND_ALERT_MESSAGE = 2,
    TIMEOUT = 3,
    BLOCK_MEMBER_INTERACTION = 4
}