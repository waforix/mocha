import { type SlashCommand, SlashCommandOptionType } from '../../../src/lib/commands/index.ts';

export const statsCommand: SlashCommand = {
  name: 'stats',
  description: 'Get user statistics',
  options: [
    {
      type: SlashCommandOptionType.USER,
      name: 'user',
      description: 'User to get stats for',
      required: false,
    },
    {
      type: SlashCommandOptionType.INTEGER,
      name: 'days',
      description: 'Number of days to look back',
      required: false,
      min_value: 1,
      max_value: 365,
    },
  ],
};

export const leaderboardCommand: SlashCommand = {
  name: 'leaderboard',
  description: 'Get server leaderboard',
  options: [
    {
      type: SlashCommandOptionType.STRING,
      name: 'type',
      description: 'Leaderboard type',
      required: true,
      choices: [
        { name: 'Messages', value: 'messages' },
        { name: 'Voice Time', value: 'voice' },
      ],
    },
    {
      type: SlashCommandOptionType.INTEGER,
      name: 'limit',
      description: 'Number of users to show',
      required: false,
      min_value: 1,
      max_value: 25,
    },
    {
      type: SlashCommandOptionType.INTEGER,
      name: 'days',
      description: 'Number of days to look back',
      required: false,
      min_value: 1,
      max_value: 365,
    },
  ],
};

export const serverCommand: SlashCommand = {
  name: 'server',
  description: 'Get server statistics',
  options: [
    {
      type: SlashCommandOptionType.INTEGER,
      name: 'days',
      description: 'Number of days to look back',
      required: false,
      min_value: 1,
      max_value: 365,
    },
  ],
};

export const cacheCommand: SlashCommand = {
  name: 'cache',
  description: 'Cache management commands',
  options: [
    {
      type: SlashCommandOptionType.STRING,
      name: 'action',
      description: 'Cache action to perform',
      required: true,
      choices: [
        { name: 'Stats', value: 'stats' },
        { name: 'Clear', value: 'clear' },
        { name: 'Metrics', value: 'metrics' },
      ],
    },
  ],
};
