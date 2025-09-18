import { Library } from "../conversion";

export type APIEmoji = {
    id: string | null;
    name: string | null;
    roles?: null//
    user?: null//
    require_colons?: boolean;
    managed?: boolean;
    animated?: boolean;
    available?: boolean;
}

export type Emoji = Library<APIEmoji>;