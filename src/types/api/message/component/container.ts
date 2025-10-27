import type { ComponentType } from '../../../../enums';
import type { Library } from '../../../conversion';
import type { APIFile } from './file';
import type { APIMediaGallery } from './mediaGallery';
import type { APISection } from './section';
import type { APISeparator } from './separator';
import type { APITextDisplay } from './textDisplay';

export type APIContainerChild =
  | APITextDisplay
  | APISection
  | APIMediaGallery
  | APISeparator
  | APIFile;

export type APIContainer = {
  type: ComponentType.CONTAINER;
  id?: number;
  components?: APIContainerChild[];
  accent_color?: number | null;
  spoiler?: boolean;
};

export type Container = Library<APIContainer>;
