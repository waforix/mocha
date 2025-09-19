import { Library } from "../../conversion";
import { APILabel } from "./label";
import { APIChannelSelect, APIMentionableSelect, APIRoleSelect, APIUserSelect } from "./mentionableSelect";
import { APIStringSelect } from "./stringSelect";
import { APITextDisplay } from "./textDisplay";
import { APITextInput } from "./textInput";

export type APIModalComponent = APIStringSelect |
    APITextInput |
    APIUserSelect |
    APIRoleSelect |
    APIMentionableSelect |
    APIChannelSelect |
    APITextDisplay |
    APILabel;

export type ModalComponent = Library<APIModalComponent>;