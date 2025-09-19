import { ButtonStyle, ComponentType } from "../../../enums";
import { Library } from "../../conversion";
import { APIEmoji } from "../emoji/emoji";

export type APIButton = {
    type: ComponentType.BUTTON;
    id?: number;
    style: ButtonStyle;
    label?: string;
    emoji?: Partial<APIEmoji>;
    custom_id?: string;
    sku_id?: string;
    url?: string;
    disabled?: boolean;
}

export type Button = Library<APIButton>;