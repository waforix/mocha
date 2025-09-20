import { ApplicationCommandPermissions, AuditLogEntry, AutoModerationRule, Channel, Entitlement, Guild, GuildMember, GuildScheduledEvent, Integration, Interaction, Invite, Message, Role, SoundboardSound, StageInstance, Subscription } from "../api";

export type Createable =
    ApplicationCommandPermissions |
    AutoModerationRule |
    Channel |
    Entitlement |
    Guild |
    AuditLogEntry |
    GuildMember |
    Role |
    GuildScheduledEvent |
    SoundboardSound |
    Integration |
    Interaction |
    Invite |
    Message |
    StageInstance |
    Subscription;