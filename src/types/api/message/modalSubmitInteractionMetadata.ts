import type { InteractionType } from "../../../enums";
import type { Library } from "../../conversion";
import type { Integration } from "../guild/integration";
import type { APIUser } from "../user/user";

export type APIModalSubmitInteractionMetadata = {
    id: string;
    type: InteractionType;
    user: APIUser;
    authorizing_integration_owners: Integration
}

export type ModalSubmitInteractionMetadata = Library<APIModalSubmitInteractionMetadata>;