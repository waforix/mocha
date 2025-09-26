import type { PollVote } from '../api';
import type { Event } from './event';

export type MessagePollVoteAdd = Event<PollVote>;

export type MessagePollVoteRemove = Event<PollVote>;
