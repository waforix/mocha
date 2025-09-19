import type { Library } from '../../../conversion';

export type APIUnfurledMediaItem = {
  url: string;
  proxy_url?: string;
  height?: number | null;
  width?: number | null;
  content_type?: string;
  attachment_id?: string;
};

export type UnfurledMediaItem = Library<APIUnfurledMediaItem>;
