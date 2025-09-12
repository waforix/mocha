import type { VoiceState } from '../types/index';
import { BaseProcessor } from './base';
export declare class VoiceProcessor extends BaseProcessor<VoiceState> {
    private voiceSessions;
    process(voiceState: VoiceState): Promise<void>;
}
