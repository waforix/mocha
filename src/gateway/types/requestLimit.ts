import { OpCode } from "../../enums/gateway";

export type RequestLimit = {
    data: number[];
    interval: number;
    limit: number;
    opCode: OpCode;
}