import { EventEmitter } from 'node:events';
import { ConnectionState } from './client';

export interface ConnectionStats {
  totalConnections: number;
  totalDisconnections: number;
  totalReconnections: number;
  totalErrors: number;
  uptime: number;
  lastConnected?: Date;
  lastDisconnected?: Date;
  averageLatency: number;
}

export class ConnectionManager extends EventEmitter {
  private stats: ConnectionStats = {
    totalConnections: 0,
    totalDisconnections: 0,
    totalReconnections: 0,
    totalErrors: 0,
    uptime: 0,
    averageLatency: 0,
  };

  private connectionStartTime?: Date;
  private latencyMeasurements: number[] = [];
  private readonly maxLatencyMeasurements = 100;

  onConnected() {
    this.stats.totalConnections++;
    this.stats.lastConnected = new Date();
    this.connectionStartTime = new Date();
    this.emit('statsUpdated', this.stats);
  }

  onDisconnected() {
    this.stats.totalDisconnections++;
    this.stats.lastDisconnected = new Date();

    if (this.connectionStartTime) {
      this.stats.uptime += Date.now() - this.connectionStartTime.getTime();
      this.connectionStartTime = undefined;
    }

    this.emit('statsUpdated', this.stats);
  }

  onReconnecting() {
    this.stats.totalReconnections++;
    this.emit('statsUpdated', this.stats);
  }

  onError() {
    this.stats.totalErrors++;
    this.emit('statsUpdated', this.stats);
  }

  recordLatency(latency: number) {
    this.latencyMeasurements.push(latency);

    if (this.latencyMeasurements.length > this.maxLatencyMeasurements) {
      this.latencyMeasurements.shift();
    }

    this.stats.averageLatency =
      this.latencyMeasurements.reduce((a, b) => a + b, 0) / this.latencyMeasurements.length;
  }

  getStats(): ConnectionStats {
    const currentUptime = this.connectionStartTime
      ? this.stats.uptime + (Date.now() - this.connectionStartTime.getTime())
      : this.stats.uptime;

    return {
      ...this.stats,
      uptime: currentUptime,
    };
  }

  reset() {
    this.stats = {
      totalConnections: 0,
      totalDisconnections: 0,
      totalReconnections: 0,
      totalErrors: 0,
      uptime: 0,
      averageLatency: 0,
    };

    this.connectionStartTime = undefined;
    this.latencyMeasurements = [];
    this.emit('statsUpdated', this.stats);
  }
}

export interface ConnectionHealthCheck {
  isHealthy: boolean;
  issues: string[];
  recommendations: string[];
}

export class ConnectionHealthMonitor {
  private readonly maxReconnectRate = 5;
  private readonly maxErrorRate = 10;
  private readonly minUptimePercentage = 95;

  checkHealth(stats: ConnectionStats, state: ConnectionState): ConnectionHealthCheck {
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (stats.totalReconnections > this.maxReconnectRate) {
      issues.push(`High reconnection rate: ${stats.totalReconnections} reconnections`);
      recommendations.push('Check network stability and Discord API status');
    }

    if (stats.totalErrors > this.maxErrorRate) {
      issues.push(`High error rate: ${stats.totalErrors} errors`);
      recommendations.push('Review error logs and check token validity');
    }

    if (stats.averageLatency > 1000) {
      issues.push(`High latency: ${stats.averageLatency.toFixed(0)}ms average`);
      recommendations.push('Check network connection and server location');
    }

    const totalTime = stats.uptime + stats.totalDisconnections * 5000;
    const uptimePercentage = totalTime > 0 ? (stats.uptime / totalTime) * 100 : 100;

    if (uptimePercentage < this.minUptimePercentage) {
      issues.push(`Low uptime: ${uptimePercentage.toFixed(1)}%`);
      recommendations.push('Investigate connection stability issues');
    }

    if (state === ConnectionState.FAILED) {
      issues.push('Connection is in failed state');
      recommendations.push('Manual intervention may be required');
    }

    return {
      isHealthy: issues.length === 0,
      issues,
      recommendations,
    };
  }
}
