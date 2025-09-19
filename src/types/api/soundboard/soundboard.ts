import type { Library } from "../../conversion";
import type { APIUser } from "../user/user";

export type APISoundboardSound = {
    name: string;
    sound_id: string;
    volume: number;
    emoji_id: string | null;
    emoji_name: string | null;
    guild_id: string | null;
    available: boolean;
    user?: APIUser;    
}

export type SoundboardSound = Library<APISoundboardSound>;