import type { Library } from "../../../conversion";
import type { APIEmoji } from "../../emoji/emoji";
import type { APIReactionCountDetails } from "./reactionCountDetails";

export type APIReaction = {
    count: number;
    count_details: APIReactionCountDetails;
    me: boolean;
    me_burst: boolean;
    emoji: Partial<APIEmoji>;
    burst_colors: string[];
}

export type Reaction = Library<APIReaction>;