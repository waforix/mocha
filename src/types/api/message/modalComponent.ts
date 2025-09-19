import type { Library } from "../../conversion";
import type { APILabel } from "./component/label";
import type { APIChannelSelect, APIMentionableSelect, APIRoleSelect, APIUserSelect } from "./component/mentionableSelect";
import type { APIStringSelect } from "./component/stringSelect";
import type { APITextDisplay } from "./component/textDisplay";
import type { APITextInput } from "./component/textInput";

export type APIModalComponent = APIStringSelect |
    APITextInput |
    APIUserSelect |
    APIRoleSelect |
    APIMentionableSelect |
    APIChannelSelect |
    APITextDisplay |
    APILabel;

export type ModalComponent = Library<APIModalComponent>;