import { StickerFormat, StickerType } from "../../enums";
import { Library } from "../conversion";
import { APIUser } from "./user";

export type APISticker = {
    id: string;
    pack_id?: string;
    name: string;
    description: string | null;
    tags: string;
    type: StickerType;
    format_type: StickerFormat;
    available?: boolean;
    guild_id?: string;
    user?: APIUser;
    sort_value?: number;
}

export type Sticker = Library<APISticker>;