import { InteractionContextType, InteractionType, MessageActivityType, MessageFlag, MessageReferenceType, MessageType } from "../../enums";
import { APIApplication } from "./application";
import { APIChannel, APIThreadMember } from "./channel";
import { APIRole } from "./role";
import { APIUser } from "./user";

export type APIMessage = {
    id: string;
    channel_id: string;
    author: APIUser;
    content: string;
    timestamp: Date;
    edited_timestamp: Date | null;
    tts: boolean;
    mention_everyone: boolean;
    mentions: APIUser[];
    mention_roles: APIRole[];
    mention_channels?: APIChannel[];
    attachments: null;
    embeds: null;
    reactions?: null;
    nonce?: number | string;
    pinned: boolean;
    webhook_id?: string;
    type: MessageType;
    activity?: APIMessageActivity;
    application?: Partial<APIApplication>;
    application_id?: string;
    flags?: number;
    message_reference?: APIMessageReference;
    interaction_metadata?: APIMessageInteractionMetadata;
    thread?: APIChannel & APIThreadMember;
    components?: 
}

export type APIMessageActivity = {
    type: MessageActivityType;
    party_id: string;
}

export type APIMessageReference = {
    type?: MessageReferenceType;
    message_id?: string;
    channel_id?: string;
    guild_id?: string;
    fail_if_not_exists?: boolean;
}

export type APIMessageInteractionMetadata = {
    id: string;
    type: InteractionType;
    user: APIUser;
    authorizing_integration_owners: Record<InteractionContextType, string>;
    original_response_message?: string;
    target_user?: APIUser;
    target_message_id?: string;
}

/**
 * @deprecated use type APIMessageInteractionMetadata
 */
export type APIInteraction = {
    id: string;
    type: InteractionType;
    name: string;
    user: APIUser;
    member: Partial<>;
}