import { Library } from "../../conversion";

export type APIPollAnswerCount = {
    id: number;
    count: number;
    me_voted: boolean;
}

export type PollAnswerCount = Library<APIPollAnswerCount>;