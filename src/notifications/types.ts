export interface NotificationRule {
  id: string;
  name: string;
  guildId: string;
  type: 'threshold' | 'trend' | 'anomaly';
  metric: 'messages' | 'voice' | 'members' | 'engagement';
  condition: {
    operator: 'gt' | 'lt' | 'eq' | 'change';
    value: number;
    timeframe: number;
  };
  actions: NotificationAction[];
  enabled: boolean;
  cooldown: number;
  lastTriggered?: Date;
}

export interface NotificationAction {
  type: 'webhook' | 'log' | 'email';
  config: Record<string, unknown>;
}

export interface NotificationEvent {
  ruleId: string;
  guildId: string;
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: Date;
}

export interface WebhookConfig {
  url: string;
  method?: 'POST' | 'PUT';
  headers?: Record<string, string>;
  template?: string;
}

export interface EmailConfig {
  to: string[];
  subject: string;
  template?: string;
}
