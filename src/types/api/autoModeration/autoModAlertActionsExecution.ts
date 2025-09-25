import { Library } from "../../conversion";
import { APIAutoModAlertAction } from "./autoModAlertAction";

export type APIAutoModAlertActionsExecution = {
    v: number;
    actions: APIAutoModAlertAction[];
}

export type AutoModAlertActionsExecution = Library<APIAutoModAlertActionsExecution>;