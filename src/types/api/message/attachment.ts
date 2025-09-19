import type { AttachmentFlag } from "../../../enums";
import type { Library } from "../../conversion";

export type APIAttachment = {
    id: string;
    filename: string;
    title?: string;
    description?: string;
    content_type?: string;
    size: number;
    url: string;
    proxy_url: string;
    height?: number | null;
    width?: number | null;
    ephemeral?: boolean | null;
    duration_secs?: number;
    waveform?: string;
    flags?: AttachmentFlag;
}

export type Attachment = Library<APIAttachment>;