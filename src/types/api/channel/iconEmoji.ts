import { Library } from "../../conversion";

export type APIIconEmoji = {
    id: string | null;
    name: string | null;
}

export type IconEmoji = Library<APIIconEmoji>;