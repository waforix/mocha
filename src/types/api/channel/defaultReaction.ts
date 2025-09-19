import type { Library } from "../../conversion";

export type APIDefaultReaction = {
    emoji_id: string | null;
    emoji_name: string | null;
}

export type DefaultReaction = Library<APIDefaultReaction>;