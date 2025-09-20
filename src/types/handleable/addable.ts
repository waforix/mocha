import { GuildMember, User } from "../api";
import { GuildEvent } from "../event/payloads/guildEvent";
import { GuildScheduledEventUserAdd } from "../event/payloads/guildScheduledEventUserAdd";
import { MessagePollVote } from "../event/payloads/messagePollVote";
import { MessageReactionAdd } from "../event/payloads/messageReactionAdd";

export type Addable =
    GuildEvent<User> |
    GuildMember |
    GuildScheduledEventUserAdd |
    MessageReactionAdd |
    MessagePollVote

