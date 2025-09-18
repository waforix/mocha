import { ButtonStyle, ComponentType, DefaultValueType, TextInputStyle } from "../../enums/messageComponent";
import { Library } from "../conversion";
import { APIEmoji } from "./emoji";

export type APIActionRow<T extends APIActionRowChild> = {
    type: ComponentType.ACTION_ROW;
    id?: number;
    components: T[];
}

export type APIActionRowChild = APIButton |
    APIStringSelect |
    APIUserSelect |
    APIRoleSelect |
    APIMentionableSelect |
    APIChannelSelect;

export type APIButton = {
    type: ComponentType.BUTTON;
    id?: number;
    style: ButtonStyle;
    label?: string;
    emoji?: Partial<APIEmoji>;
    custom_id?: string;
    sku_id?: string;
    url?: string;
    disabled?: boolean;
}

export type APIStringSelect = {
    type: ComponentType.STRING_SELECT;
    id?: number;
    custom_id: string;
    placeholder?: string;
    min_values?: number;
    max_values?: number;
    required?: boolean;
    disabled?: boolean;

}

export type APISelectOption = {
    label: string;
    value: string;
    description?: string;
    emoji?: Partial<APIEmoji>;
    default?: boolean;
}

export type APITextInput = {
    type: ComponentType.TEXT_INPUT;
    id?: number;
    custom_id: string;
    style: TextInputStyle;
    min_length?: number;
    max_length?: number;
    required?: boolean;
    value?: string;
    placeholder?: string;
}

export type APIDefaultValue<T extends DefaultValueType> = {
    id: string;
    type: T;
}

type AnyDefaultValueType = DefaultValueType.CHANNEL | DefaultValueType.ROLE | DefaultValueType.USER;

type APIMentionableSelectComponentType<
    T extends AnyDefaultValueType |
    DefaultValueType.CHANNEL |
    DefaultValueType.ROLE |
    DefaultValueType.USER> = 
{
    type: T extends AnyDefaultValueType ? ComponentType.MENTIONABLE_SELECT :
        T extends DefaultValueType.CHANNEL ? ComponentType.CHANNEL_SELECT :
        T extends DefaultValueType.ROLE ? ComponentType.ROLE_SELECT :
        ComponentType.USER_SELECT;
}

type APIMentionableSelectBase<
    T extends AnyDefaultValueType |
    DefaultValueType.CHANNEL |
    DefaultValueType.ROLE |
    DefaultValueType.USER> =
{
    type: APIMentionableSelectComponentType<T>;
    id?: number;
    custom_id: string;
    placeholder?: string;
    default_values?: APIDefaultValue<T>[];
    min_values?: number;
    max_values?: number;
    required?: boolean;
    disabled?: boolean;
}

export type APIUserSelect = APIMentionableSelectBase<DefaultValueType.USER>;

export type APIRoleSelect = APIMentionableSelectBase<DefaultValueType.ROLE>;

export type APIChannelSelect = APIMentionableSelectBase<DefaultValueType.CHANNEL>;

export type APIMentionableSelect = APIMentionableSelectBase<AnyDefaultValueType>;

export type APISection = {
    type: ComponentType.SECTION;
    id?: number;
    components: APISectionChild[];
    accessory: APISectionAccessory;
}

export type APISectionChild = APITextDisplay;

export type APISectionAccessory = APIButton | APIThumbnail;

export type APITextDisplay = {
    type: ComponentType.TEXT_DISPLAY;
    id?: number;
    content: string;
}

export type APIThumbnail = {
    type?: ComponentType.THUMBNAIL;
    id?: number;
    media: APIUnfurledMediaItem;
    description?: string;
    spoiler?: boolean;
}

export type APIUnfurledMediaItem = {
    url: string;
    proxy_url?: string;
    height?: number | null;
    width?: number | null;
    content_type?: string;
    attachment_id?: string;
}

export type APIMediaGallery = {
    type: ComponentType.MEDIA_GALLERY;
    id?: number;
    items: APIMediaGalleryItem[];
}

export type APIMediaGalleryItem = {
    media: APIUnfurledMediaItem;
    description?: string;
    spoiler?: boolean;
}

export type APIFile = {
    type: ComponentType.FILE;
    id?: number;
    file?: APIUnfurledMediaItem;
    spoiler?: boolean;
    name: string;
    size: number;
}

export type APISeparator = {
    type: ComponentType.SEPARATOR;
    id?: number;
    divider?: boolean;
    spacing?: 1 | 2;
}

export type APIContainer = {
    type: ComponentType.CONTAINER;
    id?: number;
    components?: APIContainerChild[];
    accent_color?: number | null;
    spoiler?: boolean;
}

export type APIContainerChild =
    APITextDisplay |
    APISection |
    APIMediaGallery |
    APISeparator |
    APIFile;

export type APILabel = {
    type?: ComponentType.LABEL;
    id?: number;
    label: string;
    description?: string;
    component: APILabelChild;
}

export type APIMessageComponent = APIActionRow<APIButton | APIStringSelect | APIUserSelect | APIRoleSelect | APIMentionableSelect | APIChannelSelect> |
    APITextDisplay |
    APIMediaGallery |
    APIFile |
    APISeparator |
    APIContainer

export type APIModalComponent = StringSelect |
    TextInput |
    UserSelect |
    RoleSelect |
    MentionableSelect |
    ChannelSelect |
    TextDisplay |
    Label

export type ActionRow<T extends APIActionRowChild> = Library<APIActionRow<T>>;
export type ActionRowChild = Library<APIActionRowChild>;
export type Button = Library<APIButton>;
export type StringSelect = Library<APIStringSelect>;
export type SelectOption = Library<APISelectOption>;
export type TextInput = Library<APITextInput>;
export type DefaultValue<T extends DefaultValueType> = Library<APIDefaultValue<T>>;
export type UserSelect = Library<APIUserSelect>;
export type RoleSelect = Library<APIRoleSelect>;
export type ChannelSelect = Library<APIChannelSelect>;
export type MentionableSelect = Library<APIMentionableSelect>;
export type Section = Library<APISection>;
export type SectionChild = Library<APISectionChild>;
export type SectionAccessory = Library<APISectionAccessory>;
export type TextDisplay = Library<APITextDisplay>;
export type Thumbnail = Library<APIThumbnail>;
export type UnfurledMediaItem = Library<APIUnfurledMediaItem>;
export type APILabelChild = APITextInput | APIStringSelect;
export type MediaGallery = Library<APIMediaGallery>;
export type MediaGalleryItem = Library<APIMediaGalleryItem>;
export type File = Library<APIFile>;
export type Separator = Library<APISeparator>;
export type Container = Library<APIContainer>;
export type ContainerChild = Library<APIContainerChild>;
export type Label = Library<APILabel>;
export type LabelChild = Library<APILabelChild>;
export type MessageComponent = Library<APIMessageComponent>;
export type ModalComponent = Library<APIModalComponent>;