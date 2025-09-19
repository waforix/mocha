import type { ComponentType, TextInputStyle } from '../../../../enums';
import type { Library } from '../../../conversion';

export type APITextInput = {
  type: ComponentType.TEXT_INPUT;
  id?: number;
  custom_id: string;
  style: TextInputStyle;
  min_length?: number;
  max_length?: number;
  required?: boolean;
  value?: string;
  placeholder?: string;
};

export type TextInput = Library<APITextInput>;
