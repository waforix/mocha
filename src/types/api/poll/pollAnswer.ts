import { Library } from "../../conversion";
import { APIPollMedia } from "./pollMedia";

export type APIPollAnswer = {
    answer_id: number;
    poll_media: APIPollMedia;
}

export type PollAnswer = Library<APIPollAnswer>;