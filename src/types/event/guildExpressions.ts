import { Emoji, SoundboardSound, Sticker } from "../api";
import { Event } from "./event";

export type GuildEmojisUpdate = Event<{ guildId: string; emojis: Emoji[] }>;

export type GuildStickersUpdate = Event<{ guildId: string; stickers: Sticker[] }>;

export type GuildSoundboardSoundCreate = Event<SoundboardSound>;

export type GuildSoundboardSoundUpdate = Event<SoundboardSound>;

export type GuildSoundboardSoundDelete = Event<SoundboardSound>;

export type GuildSoundboardSoundsUpdate = Event<{
    guildId: string;
    soundboardSounds: SoundboardSound[];
}>;