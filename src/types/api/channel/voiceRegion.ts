import { Library } from "../../conversion";

export type APIVoiceRegion = {
    id: string;
    name: string;
    optimal: boolean;
    deprecated: boolean;
    custom: boolean;
}

export type VoiceRegion = Library<APIVoiceRegion>;