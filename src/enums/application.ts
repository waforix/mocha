export enum ApplicationRoleConnectionMetadataType {
    INTEGER_LESS_THAN_OR_EQUAL = 1,
    INTEGER_GREATER_THAN_OR_EQUAL = 2,
    INTEGER_EQUAL = 3,
    INTEGER_NOT_EQUAL = 4,
    DATETIME_LESS_THAN_OR_EQUAL = 5,
    DATETIME_GREATER_THAN_OR_EQUAL = 6,
    BOOLEAN_EQUAL = 7,
    BOOLEAN_NOT_EQUAL = 8
}

export enum ApplicationIntegrationType {
    GUILD_INSTALL = 0,
    USER_INSTALL = 1
}

export enum ApplicationEventWebhookStatus {
    DISABLED = 1,
    ENABELD = 2,
    DISABLED_BY_DISCORD = 3
}

export enum ApplicationFlag {
    APPLICATION_AUTO_MODERATION_RULE_CREATE_BADGE = 1 << 6,
    GATEWAY_PRESENCE = 1 << 12,
    GATEWAY_PRESENCE_LIMITED = 1 << 13,
    GATEWAY_GUILD_MEMBERS = 1 << 14,
    GATEWAY_GUILD_MEMBERS_LIMITED = 1 << 15,
    VERIFICATION_PENDING_GUILD_LIMIT = 1 << 16,
    EMBEDDED = 1 << 17,
    GATEWAY_MESSAGE_CONTENT = 1 << 18,
    GATEWAY_MESSAGE_CONTENT_LIMITED = 1 << 19,
    APPLICATION_COMMAND_RESPONSE = 1 << 23
}

export enum ApplicationLocationKind {
    GuildChannel = "gc",
    PrivateChannel = "pc"
}

export enum TeamMembershipState {
    INVITED = 1,
    ACCEPTED = 2
}