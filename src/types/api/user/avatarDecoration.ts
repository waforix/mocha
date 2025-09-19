import type { Library } from "../../conversion";

export type APIAvatarDecorationData = {
    asset: string;
    sku_id: string;
}

export type AvatarDecoration = Library<APIAvatarDecorationData>;