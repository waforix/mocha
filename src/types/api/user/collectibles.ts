import { Library } from "../../conversion";
import { APINameplate } from "./nameplate";

export type APICollectibles = {
    nameplate?: APINameplate;
}

export type Collectibles = Library<APICollectibles>;