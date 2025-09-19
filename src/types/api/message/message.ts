import { MessageType } from "../../../enums";
import { APIApplication } from "../application/application";
import { APIChannel } from "../channel/channel";
import { APIThreadMember } from "../channel/threadMember";
import { APIPoll } from "../poll/poll";
import { APIRole } from "../role/role";
import { APISticker } from "../sticker/sticker";
import { APIStickerItem } from "../sticker/stickerItem";
import { APIUser } from "../user/user";
import { APIMessageActivity } from "./messageActivity";
import { APIMessageCall } from "./messageCall";
import { APIMessageComponent } from "./messageComponent";
import { APIMessageInteraction } from "./messageInteraction";
import { APIMessageInteractionMetadata } from "./messageInteractionMetadata";
import { APIMessageReference } from "./messageReference";
import { APIResolvedData } from "./resolvedData";
import { APIRoleSubscriptionData } from "./roleSubscriptionData";

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
    message_snapshops?: Partial<APIMessage>[];
    referenced_message?: APIMessage;
    interaction_metadata?: APIMessageInteractionMetadata;
    /**
     * @deprecated use interaction_metadata
     */
    interaction?: APIMessageInteraction;
    thread?: APIChannel & APIThreadMember;
    components?: APIMessageComponent[];
    sticker_items?: APIStickerItem[];
    /**
     * @deprecated use sticker_items
     */
    stickers?: APISticker;
    position?: number;
    role_subscription_data?: APIRoleSubscriptionData;
    resolved?: APIResolvedData;
    poll?: APIPoll;
    call?: APIMessageCall;
}