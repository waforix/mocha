import { Library } from "../conversion";
import { APIEmoji } from "./emoji";

export type APIPoll = {
    question: APIPollMedia;
    answers: APIPollAnswer[];
    expiry: Date | null;
    allow_multiset: boolean;
    layout_type: number;
    results?: APIPollResults;
}

export type APIPollMedia = {
    text?: string;
    emoji?: Partial<APIEmoji>;
}

export type APIPollAnswer = {
    answer_id: number;
    poll_media: APIPollMedia;
}

export type APIPollResults = {
    is_finalized: boolean;
    answer_counts: APIPollAnswerCount[];
}

export type APIPollAnswerCount = {
    id: number;
    count: number;
    me_voted: boolean;
}

export type Poll = Library<APIPoll>;
export type PollMedia = Library<APIPollMedia>;
export type PollAnswer = Library<APIPollAnswer>;
export type PollResults = Library<APIPollResults>;
export type PollAnswerCount = Library<APIPollAnswerCount>;