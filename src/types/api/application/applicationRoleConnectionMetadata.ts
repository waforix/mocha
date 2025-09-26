import type { ApplicationRoleConnectionMetadataType, Locale } from '../../../enums';
import type { Library } from '../../conversion';

export type APIApplicationRoleConnectionMetadata = {
  type: ApplicationRoleConnectionMetadataType;
  key: string;
  name: string;
  name_localizations: Partial<Record<Locale, string>>;
  description: string;
  description_localizations: Partial<Record<Locale, string>>;
};

export type ApplicationRoleConnectionMetadata = Library<APIApplicationRoleConnectionMetadata>;
