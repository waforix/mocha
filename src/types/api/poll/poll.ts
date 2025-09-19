import { Library } from "../../conversion";
import { APIPollAnswer } from "./pollAnswer";
import { APIPollMedia } from "./pollMedia";
import { APIPollResults } from "./pollResults";

export type APIPoll = {
    question: APIPollMedia;
    answers: APIPollAnswer[];
    expiry: Date | null;
    allow_multiset: boolean;
    layout_type: number;
    results?: APIPollResults;
}

export type Poll = Library<APIPoll>;