import type { Library } from "../../conversion";
import type { APIPollAnswer } from "./pollAnswer";
import type { APIPollMedia } from "./pollMedia";
import type { APIPollResults } from "./pollResults";

export type APIPoll = {
    question: APIPollMedia;
    answers: APIPollAnswer[];
    expiry: Date | null;
    allow_multiset: boolean;
    layout_type: number;
    results?: APIPollResults;
}

export type Poll = Library<APIPoll>;