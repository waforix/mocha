import { OpCode } from '../enums/gateway';
import type { RequestLimit } from './types/requestLimit';

const MAXIMUM_SEND_EVENTS = 120;
const IDENTIFY_INTERVAL = 5_000;
const PRESENCE_UPDATE_INTERVAL = 15_000;
const SEND_EVENT_INTERVAL = 60_000;

const IDENTIFY_LIMIT = {
  data: [],
  interval: IDENTIFY_INTERVAL,
  limit: 1,
  opCode: OpCode.IDENTIFY,
};

const PRESENCE_UPDATE_LIMIT = {
  data: [],
  interval: PRESENCE_UPDATE_INTERVAL,
  limit: 1,
  opCode: OpCode.PRESENCE_UPDATE,
};

const SEND_LIMIT = {
  data: [],
  interval: SEND_EVENT_INTERVAL,
  limit: MAXIMUM_SEND_EVENTS,
  opCode:
    OpCode.PRESENCE_UPDATE |
    OpCode.VOICE_STATE_UPDATE |
    OpCode.REQUEST_GUILD_MEMBERS |
    OpCode.REQUEST_SOUNDBOARD_SOUNDS,
};

export class RateLimiter {
  private requestLimits: Partial<Record<OpCode, RequestLimit>>;
  private processInterval = 100;

  public constructor() {
    this.requestLimits = {
      [OpCode.IDENTIFY]: IDENTIFY_LIMIT,
      [OpCode.PRESENCE_UPDATE]: PRESENCE_UPDATE_LIMIT,
      [OpCode.VOICE_STATE_UPDATE]: SEND_LIMIT,
      [OpCode.REQUEST_GUILD_MEMBERS]: SEND_LIMIT,
      [OpCode.REQUEST_SOUNDBOARD_SOUNDS]: SEND_LIMIT,
    };
    this.processInterval = 100;
  }

  public isRateLimited(opCode: OpCode): boolean {
    const limit = this.requestLimits[opCode];
    return limit ? limit.data.length >= limit.limit : false;
  }

  public isRequestLimited(_requestUrl: string): boolean {
    return false;
  }

  public async limit(): Promise<void> {
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, this.processInterval));
      Object.values(this.requestLimits).forEach((requestLimit) => {
        requestLimit.data.filter((i) => Date.now() - i > requestLimit.interval).shift();
      });
    }
  }

  public handleOp(opCode: OpCode): void {
    this.requestLimits[opCode]?.data.push(Date.now());
  }

  public reset(): void {
    Object.values(this.requestLimits).forEach((requestLimit) => {
      requestLimit.data = [];
    });
  }
}
