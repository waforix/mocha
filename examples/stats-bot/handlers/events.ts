import type { StatsClient } from '../../../src/index';
import { logger } from '../logger';
import { handleInteraction, type InteractionData } from './interaction';
import { handleMessage, type MessageData } from './message';

export function setupEventHandlers(client: StatsClient): void {
  client.on('eventProcessed', (event, data) => {
    logger.debug(`Processed ${event}`, { guildId: data.guild_id });

    if (event === 'MESSAGE_CREATE') {
      handleMessage(client, data as MessageData).catch((error) => {
        logger.error('Error in message handler:', error);
      });
    }

    if (event === 'INTERACTION_CREATE') {
      handleInteraction(client, data as InteractionData).catch((error) => {
        logger.error('Error in interaction handler:', error);
      });
    }
  });

  client.on('processingError', (error, event, data) => {
    logger.error(`Error processing ${event}:`, error, { data });
  });

  client.on('gatewayError', (error) => {
    logger.error('Gateway error:', error);
  });

  logger.info('Event handlers configured');
}

export function logStats(client: StatsClient): void {
  const metrics = client.getMetrics();
  const cacheStats = client.getCacheStats();

  if (metrics) {
    logger.info('Performance metrics:', {
      eventsProcessed: metrics.eventsProcessed,
      eventsPerSecond: metrics.eventsPerSecond,
      cacheHits: metrics.cacheHits,
      cacheMisses: metrics.cacheMisses,
      memoryMB: Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024),
    });
  }

  logger.info('Cache stats:', cacheStats);
}
