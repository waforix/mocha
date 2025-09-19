import type { Library } from '../../conversion';

export type APIInviteMetadata = {
  uses: number;
  max_uses: number;
  max_age: number;
  temporary: boolean;
  created_at: Date;
};

export type InviteMetadata = Library<APIInviteMetadata>;
