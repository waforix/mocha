import type { OverwriteType } from '../../../enums';
import type { Library } from '../../conversion';

export type APIOverwrite = {
  id: string;
  type: OverwriteType;
  allow: string;
  deny: string;
};

export type Overwrite = Library<APIOverwrite>;
