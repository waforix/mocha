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

export type APIStickerItem = {
    id: string;
    name: string;
    format_type: StickerFormat;
}

export type APIStickerPack = {
    id: string;
    stickers: APISticker[];
    name: string;
    sku_id: string;
    cover_sticker_id?: string;
    description: string;
    banner_asset_id?: string;
}

export type Sticker = Library<APISticker>;
export type StickerItem = Library<APIStickerItem>;
export type StickerPack = Library<APIStickerPack>;