import type { ComponentType } from '../../../../enums';
import type { Library } from '../../../conversion';
import type { APISelectOption } from './selectOption';

export type APIStringSelect = {
  type: ComponentType.STRING_SELECT;
  id?: number;
  custom_id: string;
  options: APISelectOption[];
  placeholder?: string;
  min_values?: number;
  max_values?: number;
  required?: boolean;
  disabled?: boolean;
};

export type StringSelect = Library<APIStringSelect>;
