import { InteractionCallbackType } from "../../../enums";
import { APIPoll } from "../poll/poll";
import { APIApplicationCommandOptionChoice } from "./applicationCommandOptionChoice";
import { APIAttachment } from "./attachment";
import { APIEmbed } from "./embed";
import { APIMessageComponent } from "./messageComponent";

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