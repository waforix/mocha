import type { Library } from '../../conversion';

export type APIActivityAssets = {
  large_image?: string;
  large_text?: string;
  large_url?: string;
  small_image?: string;
  small_text?: string;
  small_url?: string;
};

export type ActivityAssets = Library<APIActivityAssets>;
