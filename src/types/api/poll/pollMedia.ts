import type { Library } from "../../conversion";
import type { APIEmoji } from "../emoji/emoji";

export type APIPollMedia = {
    text?: string;
    emoji?: Partial<APIEmoji>;
}

export type PollMedia = Library<APIPollMedia>;