import { Library } from "../../conversion";

export type APIAuditLogChange<T> = {
    new_value?: T;
    old_value?: T;
    key: string;
}

export type AuditLogChange<T> = Library<APIAuditLogChange<T>>;