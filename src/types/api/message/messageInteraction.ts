import type { InteractionType } from '../../../enums';
import type { Library } from '../../conversion';
import type { APIGuildMember } from '../guild/guildMember';
import type { APIUser } from '../user/user';

export type APIMessageInteraction = {
  id: string;
  type: InteractionType;
  name: string;
  user: Partial<APIUser>;
  member: Partial<APIGuildMember>;
};

export type MessageInteraction = Library<APIMessageInteraction>;
