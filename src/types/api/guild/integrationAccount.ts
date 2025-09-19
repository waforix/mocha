import type { Library } from "../../conversion";

export type APIIntegrationAccount = {
    id: string;
    name: string;
}

export type IntegrationAccount = Library<APIIntegrationAccount>;