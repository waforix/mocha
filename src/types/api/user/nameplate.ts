import type { Library } from '../../conversion';

export type APINameplate = {
  sku_id: string;
  asset: string;
  label: string;
  palette:
    | 'crimson'
    | 'berry'
    | 'sky'
    | 'teal'
    | 'forest'
    | 'bubble_gum'
    | 'violet'
    | 'cobalt'
    | 'clover'
    | 'lemon'
    | 'white';
};

export type Nameplate = Library<APINameplate>;
