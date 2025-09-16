import { Event } from "../enums";
import { EventHandler } from "../types";

export class Dispatcher {
    private static instance: Dispatcher;
    private eventHandlers: Record<string, EventHandler[]>;

    public constructor() {
        this.eventHandlers = {};
    }

    public static getInstance(): Dispatcher {
        if (this.instance === undefined) {
            this.instance = new Dispatcher();
        }
        return this.instance;
    }

    public async handle(event: Event, ...args: any): Promise<void> {
        if (this.eventHandlers[event]) {
            this.eventHandlers[event].forEach(async (eventHandler) => {
                await eventHandler(args);
            });
        }
    }

    public on(event: Event, callback: (...args: any) => Promise<void>) {
        if (this.eventHandlers[event] &&
            this.eventHandlers[event].length > 0
        ) {
            this.eventHandlers[event].push(callback);
        } else {
            this.eventHandlers[event] = [callback];
        }
    }
}