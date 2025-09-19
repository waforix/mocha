import type { ComponentType } from '../../../../enums';
import type { Library } from '../../../conversion';

export type APISeparator = {
  type: ComponentType.SEPARATOR;
  id?: number;
  divider?: boolean;
  spacing?: 1 | 2;
};

export type Separator = Library<APISeparator>;
