import { Library } from "../../conversion";
import { APIEmoji } from "../emoji/emoji";
import { APIReactionCountDetails } from "./reactionCountDetails";

export type APIReaction = {
    count: number;
    count_details: APIReactionCountDetails;
    me: boolean;
    me_burst: boolean;
    emoji: Partial<APIEmoji>;
    burst_colors: string[];
}

export type Reaction = Library<APIReaction>;