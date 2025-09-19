import { Scope } from "../../../enums";
import { Library } from "../../conversion";

export type APIInstallParams = {
    scopes: Scope[];
    permissions: string;
}

export type InstallParams = Library<APIInstallParams>;