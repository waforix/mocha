export enum SKUType {
    DURABLE = 2,
    CONSUMABLE = 3,
    SUBSCRIPTION = 5,
    SUBSCRIPTION_GROUP = 6
}

export enum SKUFlag {
    AVAILABLE = 1 << 2,
    GUILD_SUBSCRIPTION = 1 << 7,
    USER_SUBSCRIPTION = 1 << 8
}