import { SKUFlag, SKUType } from "../../enums/sku";

export type APISKU = {
    id: string;
    type: SKUType;
    application_id: string;
    name: string;
    slug: string;
    flags: SKUFlag;
}