import type { Event } from '../../enums';
import type {
  ApplicationCommandPermissions,
  AuditLogEntry,
  AutoModerationRule,
  Channel,
  Emoji,
  Entitlement,
  Guild,
  GuildMember,
  GuildScheduledEvent,
  Integration,
  Interaction,
  Role,
  SoundboardSound,
  StageInstance,
  Sticker,
  Subscription,
  User,
  VoiceState,
} from '../api';
import type { AutoModerationActionExecution } from './payloads/autoModerationActionExecution';
import type { ChannelPinsUpdate } from './payloads/channelPinsUpdate';
import type { GuildCreate } from './payloads/guildCreate';
import type { GuildEvent } from './payloads/guildEvent';
import type { GuildMemberUpdate } from './payloads/guildMemberUpdate';
import type { GuildScheduledEventUserAdd } from './payloads/guildScheduledEventUserAdd';
import type { GuildScheduledEventUserRemove } from './payloads/guildScheduledEventUserRemove';
import type { InviteCreate } from './payloads/inviteCreate';
import type { InviteDelete } from './payloads/inviteDelete';
import type { MessageCreate } from './payloads/messageCreate';
import type { MessageDelete } from './payloads/messageDelete';
import type { MessageDeleteBulk } from './payloads/messageDeleteBulk';
import type { MessagePollVote } from './payloads/messagePollVote';
import type { MessageReactionAdd } from './payloads/messageReactionAdd';
import type { MessageReactionRemove } from './payloads/messageReactionRemove';
import type { MessageReactionRemoveAll } from './payloads/messageReactionRemoveAll';
import type { MessageReactionRemoveEmoji } from './payloads/messageReactionRemoveEmoji';
import type { PresenceUpdate } from './payloads/presenceUpdate';
import type { ThreadDelete } from './payloads/threadDelete';
import type { ThreadListSync } from './payloads/threadListSync';
import type { ThreadMembersUpdate } from './payloads/threadMembersUpdate';
import type { TypingStart } from './payloads/typingStart';
import type { VoiceChannelEffectSend } from './payloads/voiceChannelEffectSend';
import type { VoiceServerUpdate } from './payloads/voiceServerUpdate';
import type { WebhooksUpdate } from './payloads/webhooksUpdate';

export type Payload<T extends Event> = T extends Event.APPLICATION_COMMAND_PERMISSIONS_UPDATE
  ? ApplicationCommandPermissions
  : T extends Event.AUTO_MODERATION_RULE_CREATE
    ? AutoModerationRule
    : T extends Event.AUTO_MODERATION_RULE_UPDATE
      ? AutoModerationRule
      : T extends Event.AUTO_MODERATION_RULE_DELETE
        ? AutoModerationRule
        : T extends Event.AUTO_MODERATION_ACTION_EXECUTION
          ? AutoModerationActionExecution
          : T extends Event.CHANNEL_CREATE
            ? Channel
            : T extends Event.CHANNEL_UPDATE
              ? Channel
              : T extends Event.CHANNEL_DELETE
                ? Channel
                : T extends Event.THREAD_CREATE
                  ? Channel
                  : T extends Event.THREAD_UPDATE
                    ? Channel
                    : T extends Event.THREAD_DELETE
                      ? ThreadDelete
                      : T extends Event.THREAD_LIST_SYNC
                        ? ThreadListSync
                        : T extends Event.THREAD_MEMBERS_UPDATE
                          ? ThreadMembersUpdate
                          : T extends Event.CHANNEL_PINS_UPDATE
                            ? ChannelPinsUpdate
                            : T extends Event.ENTITLEMENT_CREATE
                              ? Entitlement
                              : T extends Event.ENTITLEMENT_UPDATE
                                ? Entitlement
                                : T extends Event.ENTITLEMENT_DELETE
                                  ? Entitlement
                                  : T extends Event.GUILD_CREATE
                                    ? GuildCreate
                                    : T extends Event.GUILD_UPDATE
                                      ? Guild
                                      : T extends Event.GUILD_DELETE
                                        ? Guild
                                        : T extends Event.GUILD_AUDIT_LOG_ENTRY_CREATE
                                          ? AuditLogEntry
                                          : T extends Event.GUILD_BAN_ADD
                                            ? GuildEvent<User>
                                            : T extends Event.GUILD_BAN_REMOVE
                                              ? GuildEvent<User>
                                              : T extends Event.GUILD_EMOJIS_UPDATE
                                                ? GuildEvent<Emoji[]>
                                                : T extends Event.GUILD_STICKERS_UPDATE
                                                  ? GuildEvent<Sticker[]>
                                                  : T extends Event.GUILD_INTEGRATIONS_UPDATE
                                                    ? GuildEvent<Integration[]>
                                                    : T extends Event.GUILD_MEMBER_ADD
                                                      ? GuildEvent<GuildMember>
                                                      : T extends Event.GUILD_MEMBER_REMOVE
                                                        ? GuildEvent<User>
                                                        : T extends Event.GUILD_MEMBER_UPDATE
                                                          ? GuildMemberUpdate
                                                          : T extends Event.GUILD_ROLE_CREATE
                                                            ? GuildEvent<Role>
                                                            : T extends Event.GUILD_ROLE_UPDATE
                                                              ? GuildEvent<Role>
                                                              : T extends Event.GUILD_ROLE_DELETE
                                                                ? GuildEvent<Role>
                                                                : T extends Event.GUILD_SCHEDULED_EVENT_CREATE
                                                                  ? GuildScheduledEvent
                                                                  : T extends Event.GUILD_SCHEDULED_EVENT_UPDATE
                                                                    ? GuildScheduledEvent
                                                                    : T extends Event.GUILD_SCHEDULED_EVENT_DELETE
                                                                      ? GuildScheduledEvent
                                                                      : T extends Event.GUILD_SCHEDULED_EVENT_USER_ADD
                                                                        ? GuildScheduledEventUserAdd
                                                                        : T extends Event.GUILD_SCHEDULED_EVENT_USER_REMOVE
                                                                          ? GuildScheduledEventUserRemove
                                                                          : T extends Event.GUILD_SOUNDBOARD_SOUND_CREATE
                                                                            ? SoundboardSound
                                                                            : T extends Event.GUILD_SOUNDBOARD_SOUND_UPDATE
                                                                              ? SoundboardSound
                                                                              : T extends Event.GUILD_SOUNDBOARD_SOUND_DELETE
                                                                                ? SoundboardSound
                                                                                : T extends Event.GUILD_SOUNDBOARD_SOUNDS_UPDATE
                                                                                  ? GuildEvent<
                                                                                      SoundboardSound[]
                                                                                    >
                                                                                  : T extends Event.INTEGRATION_CREATE
                                                                                    ? GuildEvent<Integration>
                                                                                    : T extends Event.INTEGRATION_UPDATE
                                                                                      ? GuildEvent<Integration>
                                                                                      : T extends Event.INTEGRATION_DELETE
                                                                                        ? GuildEvent<Integration>
                                                                                        : T extends Event.INVITE_CREATE
                                                                                          ? InviteCreate
                                                                                          : T extends Event.INVITE_DELETE
                                                                                            ? InviteDelete
                                                                                            : T extends Event.MESSAGE_CREATE
                                                                                              ? MessageCreate
                                                                                              : T extends Event.MESSAGE_UPDATE
                                                                                                ? MessageCreate
                                                                                                : T extends Event.MESSAGE_DELETE
                                                                                                  ? MessageDelete
                                                                                                  : T extends Event.MESSAGE_DELETE_BULK
                                                                                                    ? MessageDeleteBulk
                                                                                                    : T extends Event.MESSAGE_REACTION_ADD
                                                                                                      ? MessageReactionAdd
                                                                                                      : T extends Event.MESSAGE_REACTION_REMOVE
                                                                                                        ? MessageReactionRemove
                                                                                                        : T extends Event.MESSAGE_REACTION_REMOVE_ALL
                                                                                                          ? MessageReactionRemoveAll
                                                                                                          : T extends Event.MESSAGE_REACTION_REMOVE_EMOJI
                                                                                                            ? MessageReactionRemoveEmoji
                                                                                                            : T extends Event.PRESENCE_UPDATE
                                                                                                              ? PresenceUpdate
                                                                                                              : T extends Event.TYPING_START
                                                                                                                ? TypingStart
                                                                                                                : T extends Event.USER_UPDATE
                                                                                                                  ? User
                                                                                                                  : T extends Event.VOICE_CHANNEL_EFFECT_SEND
                                                                                                                    ? VoiceChannelEffectSend
                                                                                                                    : T extends Event.VOICE_STATE_UPDATE
                                                                                                                      ? VoiceState
                                                                                                                      : T extends Event.VOICE_SERVER_UPDATE
                                                                                                                        ? VoiceServerUpdate
                                                                                                                        : T extends Event.WEBHOOKS_UPDATE
                                                                                                                          ? WebhooksUpdate
                                                                                                                          : T extends Event.INTERACTION_CREATE
                                                                                                                            ? Interaction
                                                                                                                            : T extends Event.STAGE_INSTANCE_CREATE
                                                                                                                              ? StageInstance
                                                                                                                              : T extends Event.STAGE_INSTANCE_UPDATE
                                                                                                                                ? StageInstance
                                                                                                                                : T extends Event.STAGE_INSTANCE_DELETE
                                                                                                                                  ? StageInstance
                                                                                                                                  : T extends Event.SUBSCRIPTION_CREATE
                                                                                                                                    ? Subscription
                                                                                                                                    : T extends Event.SUBSCRIPTION_UPDATE
                                                                                                                                      ? Subscription
                                                                                                                                      : T extends Event.SUBSCRIPTION_DELETE
                                                                                                                                        ? Subscription
                                                                                                                                        : T extends Event.MESSAGE_POLL_VOTE_ADD
                                                                                                                                          ? MessagePollVote
                                                                                                                                          : T extends Event.MESSAGE_POLL_VOTE_REMOVE
                                                                                                                                            ? MessagePollVote
                                                                                                                                            : never;
