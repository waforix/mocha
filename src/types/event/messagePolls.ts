import { PollVote } from "../api";
import { Event } from "./event";

export type MessagePollVoteAdd = Event<PollVote>;

export type MessagePollVoteRemove = Event<PollVote>;