import type { InteractionCallbackType } from "../../../../enums";
import type { APIPoll } from "../../poll/poll";
import type { APIApplicationCommandOptionChoice } from "../applicationCommand/applicationCommandOptionChoice";
import type { APIAttachment } from "../attachment";
import type { APIEmbed } from "../embed/embed";
import type { APIMessageComponent } from "./../messageComponent";

export type APIInteractionCallbackData<
    T = InteractionCallbackType> = T extends (
        InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE |
        InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE |
        InteractionCallbackType.DEFERRED_UPDATE_MESSAGE |
        InteractionCallbackType.UPDATE_MESSAGE) ? 
{
    tts?: boolean;
    content?: string;
    embeds?: APIEmbed[];
    allowed_mentions?: string;
    flags?: number;
    components?: APIMessageComponent[];
    attachments?: Partial<APIAttachment>;
    poll?: APIPoll;
}
: T extends InteractionCallbackType.APPLICATION_COMMAND_AUTO_COMPLETE_RESULT ?
{
    choices: APIApplicationCommandOptionChoice[];
} : never;