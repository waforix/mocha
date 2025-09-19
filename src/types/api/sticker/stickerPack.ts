import { Library } from "../../conversion";
import { APISticker } from "./sticker";

export type APIStickerPack = {
    id: string;
    stickers: APISticker[];
    name: string;
    sku_id: string;
    cover_sticker_id?: string;
    description: string;
    banner_asset_id?: string;
}

export type StickerPack = Library<APIStickerPack>;