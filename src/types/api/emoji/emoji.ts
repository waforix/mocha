import { Library } from "../../conversion";
import { APIUser } from "../user/user";

export type APIEmoji = {
    id: string | null;
    name: string | null;
    roles?: string[];
    user?: APIUser;
    require_colons?: boolean;
    managed?: boolean;
    animated?: boolean;
    available?: boolean;
}

export type Emoji = Library<APIEmoji>;