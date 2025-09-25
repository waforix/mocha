import { Library } from "../../conversion";

export type APIAutoModAlertAction = {
    actor: string;
    ts: number;
}

export type AutoModAlertAction = Library<APIAutoModAlertAction>;