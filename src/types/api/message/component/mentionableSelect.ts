import type { ComponentType, DefaultValueType } from "../../../../enums";
import type { Library } from "../../../conversion";

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

export type APIMentionableSelect = APIMentionableSelectBase<AnyDefaultValueType>;

export type APIChannelSelect = APIMentionableSelectBase<DefaultValueType.CHANNEL>;

export type UserSelect = Library<APIUserSelect>;

export type RoleSelect = Library<APIRoleSelect>;

export type MentionableSelect = Library<APIMentionableSelect>;

export type ChannelSelect = Library<APIChannelSelect>;