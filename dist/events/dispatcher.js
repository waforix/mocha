import { EventEmitter } from 'node:events';
import { getDb } from '../db/index';
import { EVENTS } from '../gateway/constants';
import { GuildProcessor, MemberProcessor, MessageProcessor, PresenceProcessor, VoiceProcessor, } from '../processors/index';
export class EventDispatcher extends EventEmitter {
    db = getDb();
    messageProcessor = new MessageProcessor(this.db);
    voiceProcessor = new VoiceProcessor(this.db);
    memberProcessor = new MemberProcessor(this.db);
    presenceProcessor = new PresenceProcessor(this.db);
    guildProcessor = new GuildProcessor(this.db);
    async dispatch(event, data) {
        try {
            switch (event) {
                case EVENTS.MESSAGE_CREATE:
                    await this.messageProcessor.process(data);
                    break;
                case EVENTS.VOICE_STATE_UPDATE:
                    await this.voiceProcessor.process(data);
                    break;
                case EVENTS.GUILD_MEMBER_ADD:
                    await this.memberProcessor.processJoin(data);
                    break;
                case EVENTS.GUILD_MEMBER_REMOVE:
                    await this.memberProcessor.processLeave(data);
                    break;
                case EVENTS.PRESENCE_UPDATE:
                    await this.presenceProcessor.process(data);
                    break;
                case EVENTS.GUILD_CREATE:
                    await this.guildProcessor.process(data);
                    break;
            }
            this.emit('processed', event, data);
        }
        catch (error) {
            this.emit('error', error, event, data);
        }
    }
}
