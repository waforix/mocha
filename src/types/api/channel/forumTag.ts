import { ForumTagName } from "../../../enums";
import { Library } from "../../conversion";

export type APIForumTag = {
    id: string;
    name: ForumTagName;
    moderated: boolean;
    emoji_id: string | null;
    emoji_name: string | null;
}

export type ForumTag = Library<APIForumTag>;