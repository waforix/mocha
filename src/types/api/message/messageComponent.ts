import { Library } from "../../conversion";
import { APIActionRow } from "./actionRow";
import { APIButton } from "./button";
import { APIContainer } from "./container";
import { APIFile } from "./file";
import { APIMediaGallery } from "./mediaGallery";
import { APIChannelSelect, APIMentionableSelect, APIRoleSelect, APIUserSelect } from "./mentionableSelect";
import { APISeparator } from "./separator";
import { APIStringSelect } from "./stringSelect";
import { APITextDisplay } from "./textDisplay";

export type APIMessageComponent = APIActionRow<APIButton | APIStringSelect | APIUserSelect | APIRoleSelect | APIMentionableSelect | APIChannelSelect> |
    APITextDisplay |
    APIMediaGallery |
    APIFile |
    APISeparator |
    APIContainer;

export type MessageComponent = Library<APIMessageComponent>;