import { Library } from "../../conversion";

export type APIReactionCountDetails = {
    burst: number;
    normal: number;
}

export type ReactionCountDetails = Library<APIReactionCountDetails>;