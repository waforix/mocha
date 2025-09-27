import type { Library } from '../../conversion';

export type APILinkedLobby = {
  application_id: string;
  lobby_id: string;
  linked_by: string;
  linked_at: Date;
  require_application_authorization: boolean;
};

export type LinkedLobby = Library<APILinkedLobby>;
