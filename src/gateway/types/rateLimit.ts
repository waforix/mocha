import { RateLimitScope } from "../../enums/gateway";

export type RateLimit = {
    bucket?: string;
    remaining: number;
    route: string;
    reset?: number;
    resetAfter?: number;
    scope?: RateLimitScope;
}