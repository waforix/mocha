import { Library } from "../../conversion";
import { APIEmoji } from "../emoji/emoji";

export type APIPollMedia = {
    text?: string;
    emoji?: Partial<APIEmoji>;
}

export type PollMedia = Library<APIPollMedia>;