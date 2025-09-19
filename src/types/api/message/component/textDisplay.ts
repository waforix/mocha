import type { ComponentType } from '../../../../enums';
import type { Library } from '../../../conversion';

export type APITextDisplay = {
  type: ComponentType.TEXT_DISPLAY;
  id?: number;
  content: string;
};

export type TextDisplay = Library<APITextDisplay>;
