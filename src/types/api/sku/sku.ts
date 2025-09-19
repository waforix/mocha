import type { SKUFlag, SKUType } from "../../../enums";
import type { Library } from "../../conversion";

export type APISKU = {
    id: string;
    type: SKUType;
    application_id: string;
    name: string;
    slug: string;
    flags: SKUFlag;
}

export type SKU = Library<APISKU>;