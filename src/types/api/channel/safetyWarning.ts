import { SafetyWarningType } from "../../../enums/channel";
import { Library } from "../../conversion";

export type APISafetyWarning = {
    id: string;
    type: SafetyWarningType;
}

export type SafetyWarning = Library<APISafetyWarning>;