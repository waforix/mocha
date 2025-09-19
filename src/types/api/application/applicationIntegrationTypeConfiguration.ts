import { Library } from "../../conversion";
import { APIInstallParams } from "./installParams";

export type APIApplicationIntegrationTypeConfiguration = {
    oauth2_install_params: APIInstallParams;
}

export type ApplicationIntegrationTypeConfiguration = Library<APIApplicationIntegrationTypeConfiguration>;