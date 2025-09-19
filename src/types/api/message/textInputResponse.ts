import type { ComponentType } from '../../../enums';
import type { Library } from '../../conversion';

export type APITextInputResponse = {
  type: ComponentType.TEXT_INPUT;
  id: number;
  custom_id: string;
  value: string;
};

export type TextInputResponse = Library<APITextInputResponse>;
