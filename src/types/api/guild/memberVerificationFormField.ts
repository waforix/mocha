import type { MemberVerificationFormFieldType } from '../../../enums';
import type { Library } from '../../conversion';

export type APIMemberVerificationFormField = {
  field_type: MemberVerificationFormFieldType;
  label: string;
  choices?: string[];
  values?: string[] | null;
  response?: string | number | boolean | null;
  required: boolean;
  description: string | null;
  automations: string[] | null;
  placeholder?: string | null;
};

export type MemberVerificationFormField = Library<APIMemberVerificationFormField>;
