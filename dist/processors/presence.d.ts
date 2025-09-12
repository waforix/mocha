import type { PresenceUpdate } from '../types/index';
import { BaseProcessor } from './base';
export declare class PresenceProcessor extends BaseProcessor<PresenceUpdate> {
    private lastPresence;
    process(presence: PresenceUpdate): Promise<void>;
}
