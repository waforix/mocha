import type { Message } from '../types/index';
import { BaseProcessor } from './base';
export declare class MessageProcessor extends BaseProcessor<Message> {
    process(message: Message): Promise<void>;
}
