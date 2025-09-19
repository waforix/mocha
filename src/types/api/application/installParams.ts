import type { Scope } from "../../../enums";
import type { Library } from "../../conversion";

export type APIInstallParams = {
    scopes: Scope[];
    permissions: string;
}

export type InstallParams = Library<APIInstallParams>;