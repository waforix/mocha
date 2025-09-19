import type { ComponentType } from '../../../enums';
import type { Library } from '../../conversion';
import type { APIResolvedData } from './resolvedData';

export type APIMessageComponentData = {
  custom_id: string;
  component_type: ComponentType;
  values?: string;
  resolved?: APIResolvedData;
};

export type MessageComponentData = Library<APIMessageComponentData>;
