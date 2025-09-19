import { InteractionType } from "../../../enums";
import { Library } from "../../conversion";
import { Integration } from "../guild/integration";
import { APIUser } from "../user/user";

export type APIModalSubmitInteractionMetadata = {
    id: string;
    type: InteractionType;
    user: APIUser;
    authorizing_integration_owners: Integration
}

export type ModalSubmitInteractionMetadata = Library<APIModalSubmitInteractionMetadata>;