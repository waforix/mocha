import { StatusType } from "../../../enums/presence"
import { Library } from "../../conversion";

export type APIClientStatus = {
    desktop?: StatusType;
    mobile?: StatusType;
    web?: StatusType;
    embedded?: StatusType;
}

export type ClientStatus = Library<APIClientStatus>;