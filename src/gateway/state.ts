import { EventEmitter } from 'node:events';

export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  FAILED = 'failed',
}

export interface SessionInfo {
  sessionId?: string;
  sequence: number | null;
  resumeUrl?: string;
  reconnectAttempts: number;
}

export class GatewayStateManager extends EventEmitter {
  private state = ConnectionState.DISCONNECTED;
  private sessionInfo: SessionInfo = {
    sequence: null,
    reconnectAttempts: 0,
  };

  getState(): ConnectionState {
    return this.state;
  }

  setState(newState: ConnectionState) {
    if (this.state !== newState) {
      const oldState = this.state;
      this.state = newState;
      this.emit('stateChange', newState, oldState);
    }
  }

  getSessionInfo(): SessionInfo {
    return { ...this.sessionInfo };
  }

  updateSession(updates: Partial<SessionInfo>) {
    this.sessionInfo = { ...this.sessionInfo, ...updates };
    this.emit('sessionUpdate', this.sessionInfo);
  }

  setSequence(sequence: number | null) {
    this.sessionInfo.sequence = sequence;
  }

  incrementReconnectAttempts() {
    this.sessionInfo.reconnectAttempts++;
  }

  resetReconnectAttempts() {
    this.sessionInfo.reconnectAttempts = 0;
  }

  canResume(): boolean {
    return !!(this.sessionInfo.sessionId && this.sessionInfo.resumeUrl);
  }

  reset() {
    this.sessionInfo = {
      sequence: null,
      reconnectAttempts: 0,
    };
    this.setState(ConnectionState.DISCONNECTED);
  }

  isConnected(): boolean {
    return this.state === ConnectionState.CONNECTED;
  }

  isConnecting(): boolean {
    return this.state === ConnectionState.CONNECTING;
  }

  isFailed(): boolean {
    return this.state === ConnectionState.FAILED;
  }
}
