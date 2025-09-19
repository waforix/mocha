import { StickerFormat } from "../../../enums";
import { Library } from "../../conversion";

export type APIStickerItem = {
    id: string;
    name: string;
    format_type: StickerFormat;
}

export type StickerItem = Library<APIStickerItem>;

