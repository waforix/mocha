import { EventEmitter } from 'node:events';
export declare class EventDispatcher extends EventEmitter {
    private db;
    private messageProcessor;
    private voiceProcessor;
    private memberProcessor;
    private presenceProcessor;
    private guildProcessor;
    dispatch(event: string, data: unknown): Promise<void>;
}
