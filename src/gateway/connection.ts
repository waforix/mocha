import { EventEmitter } from "node:events";

const MAX_AVERAGE_LATENCY = 1_000;
const MAX_ERROR_RATE = 10;
const MAX_RECONNECT_RATE = 5;
const MAX_LATENCY_MEASUREMENTS = 100;
const MIN_UPTIME_PERCENTAGE = 95;

export class Connection extends EventEmitter {
    private averageLatency: number;
    private latencyMeasurements: number[];
    private connects: number;
    private disconnects: number;
    private reconnects: number;
    private errors: number;
    private firstConnected: number;
    private lastConnected?: number;
    private lastDisconnected?: number;
    private uptime: number;
    
    public constructor() {
        super();
        this.averageLatency = 0;
        this.latencyMeasurements = [];
        this.connects = 0;
        this.disconnects = 0;
        this.reconnects = 0;
        this.errors = 0;
        this.firstConnected = Date.now();
        this.uptime = 0;
    }

    public onConnect(): void {
        this.connects++;
        this.lastConnected = Date.now();
        this.update();
    }

    public onDisconnect(): void {
        this.disconnects++;
        this.lastDisconnected = Date.now();
        if (this.lastConnected) {
            this.uptime += (Date.now() - this.lastConnected);
            this.lastConnected = undefined;
        }
        this.update();
    }

    public onReconnect(): void {
        this.reconnects++;
        this.update();
    }

    public onError(): void {
        this.errors++;
        this.update();
    }

    public recordLatency(latency: number): void {
        this.latencyMeasurements.push(latency);
        this.latencyMeasurements.length > MAX_LATENCY_MEASUREMENTS ?
            this.latencyMeasurements.shift() : {};
        this.averageLatency = this.latencyMeasurements
            .reduce((a, b) => a + b) / this.latencyMeasurements.length;
    }

    public getHealth() {
        const warnings: string[] = [];
        const stats = this.getStats();
        const uptimePercentage = (this.uptime / (Date.now() - this.firstConnected)) * 100;
        if (stats.reconnects > MAX_RECONNECT_RATE) {
            warnings.push(`High reconnection rate: ${stats.reconnects} reconnects. ` +
                `Check network stability and Discord API status.`);
        }
        if (stats.errors > MAX_ERROR_RATE) {
            warnings.push(`High error rate: ${stats.errors} errors. ` +
                `Review error logs and check token validity.`);
        }
        if (stats.averageLatency > MAX_AVERAGE_LATENCY) {
            warnings.push(`High latency: ${stats.averageLatency.toFixed(0)}ms. ` +
                `Check network connection and server location.`);
        }
        if (uptimePercentage < MIN_UPTIME_PERCENTAGE) {
            warnings.push(`Low uptime: ${uptimePercentage.toFixed(1)}%. ` +
                `Investigate connection stability issues.`);
        }
        return {
            health: warnings.length === 0,
            warnings: warnings
        };
    }

    public getStats() {
        if (this.lastConnected) {
            this.uptime += (Date.now() - this.lastConnected);
        }
        return {
            averageLatency: this.averageLatency,
            connects: this.connects,
            disconnects: this.disconnects,
            reconnects: this.reconnects,
            errors: this.errors,
            firstConnected: this.firstConnected,
            lastConnected: this.lastConnected ? new Date(this.lastConnected) : "never",
            lastDisconnected: this.lastDisconnected ? new Date(this.lastDisconnected) : "never",
            uptime: this.uptime
        };
    }

    public reset(): void {
        this.averageLatency = 0;
        this.latencyMeasurements = [];
        this.connects = 0;
        this.disconnects = 0;
        this.reconnects = 0;
        this.errors = 0;
        this.lastConnected = undefined;
        this.lastDisconnected = undefined;
        this.uptime = 0;
        this.update();
    }

    private update(): void {
        this.emit("statsUpdated", this.getStats());
    }
}