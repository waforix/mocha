import type { Library } from "../../conversion";
import type { APIInstallParams } from "./installParams";

export type APIApplicationIntegrationTypeConfiguration = {
    oauth2_install_params: APIInstallParams;
}

export type ApplicationIntegrationTypeConfiguration = Library<APIApplicationIntegrationTypeConfiguration>;