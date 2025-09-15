import type { StatsClient } from '../../../src/index';
import { handleCommand } from '../commands/index';
import { logger } from '../logger';

export interface InteractionData {
  id: string;
  type: number;
  data?: {
    name: string;
    options?: Array<{
      name: string;
      value: string | number | boolean;
      type: number;
    }>;
  };
  guild_id?: string;
  channel_id: string;
  member?: {
    user: {
      id: string;
      username: string;
    };
  };
  user?: {
    id: string;
    username: string;
  };
  token: string;
}

export async function handleInteraction(client: StatsClient, data: InteractionData): Promise<void> {
  try {
    if (data.type !== 2) return;
    if (!data.data) return;

    const user = data.member?.user || data.user;
    if (!user) return;

    const options = data.data.options || [];

    // Handle slash command options properly by name
    let commandString = `!${data.data.name}`;

    // For stats command, handle the days parameter specifically
    if (data.data.name === 'stats') {
      const daysOption = options.find(opt => opt.name === 'days');
      if (daysOption) {
        commandString += ` ${daysOption.value}`;
      }
    } else {
      // For other commands, convert options to positional arguments
      const args = options.map((opt) => {
        if (typeof opt.value === 'number') {
          return opt.value.toString();
        }
        return String(opt.value);
      });
      if (args.length > 0) {
        commandString += ` ${args.join(' ')}`;
      }
    }

    const response = await handleCommand(
      client,
      commandString,
      data.guild_id || '',
      data.channel_id,
      user.id,
      user.username
    );

    if (response) {
      await sendInteractionResponse(data.id, data.token, response);
    }
  } catch (error) {
    logger.error('Error handling interaction:', error);
    await sendInteractionResponse(
      data.id,
      data.token,
      '❌ An error occurred while processing your command.'
    );
  }
}

async function sendInteractionResponse(
  interactionId: string,
  token: string,
  content: string
): Promise<void> {
  const url = `https://discord.com/api/v10/interactions/${interactionId}/${token}/callback`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 4,
      data: {
        content,
        flags: 64,
      },
    }),
  });

  if (!response.ok) {
    logger.error(`Failed to send interaction response: ${response.status} ${response.statusText}`);
  }
}
