export enum ComponentType {
    ACTION_ROW = 1,
    BUTTON = 2,
    STRING_SELECT = 3,
    TEXT_INPUT = 4,
    USER_SELECT = 5,
    ROLE_SELECT = 6,
    MENTIONABLE_SELECT = 7,
    CHANNEL_SELECT = 8,
    SECTION = 9,
    TEXT_DISPLAY = 10,
    THUMBNAIL = 11,
    MEDIA_GALLERY = 12,
    FILE = 13,
    SEPARATOR = 14,
    CONTAINER = 17,
    LABEL = 18
}

export enum ButtonStyle {
    PRIMARY = 1,
    SECONDARY = 2,
    SUCCESS = 3,
    DANGER = 4,
    LINK = 5,
    PREMIUM = 6
}

export enum TextInputStyle {
    SHORT = 1,
    PARAGRAPH = 2
}

export enum DefaultValueType {
    USER = "user",
    ROLE = "role",
    CHANNEL = "channel"
}