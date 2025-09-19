import type { ForumTagName } from '../../../enums';
import type { Library } from '../../conversion';

export type APIForumTag = {
  id: string;
  name: ForumTagName;
  moderated: boolean;
  emoji_id: string | null;
  emoji_name: string | null;
};

export type ForumTag = Library<APIForumTag>;
