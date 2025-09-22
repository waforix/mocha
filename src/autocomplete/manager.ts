import { AutocompleteRegistry } from './registry';
import { createAutocompleteResponse } from './response';
import type { AutocompleteContext, AutocompleteHandler, AutocompleteResponse } from './types';

export class AutocompleteManager {
  private registry = new AutocompleteRegistry();

  register(commandName: string, optionName: string, handler: AutocompleteHandler): void {
    this.registry.register(commandName, optionName, handler);
  }

  // biome-ignore lint/suspicious/noExplicitAny: Discord interaction types are complex and dynamic
  async handleAutocomplete(interaction: any): Promise<AutocompleteResponse> {
    const commandName = interaction.data?.name;
    // biome-ignore lint/suspicious/noExplicitAny: Discord option types are dynamic
    const focusedOption = interaction.data?.options?.find((opt: any) => opt.focused);

    if (!commandName || !focusedOption) {
      return createAutocompleteResponse([]);
    }

    const handler = this.registry.get(commandName, focusedOption.name);
    if (!handler) {
      return createAutocompleteResponse([]);
    }

    const context: AutocompleteContext = {
      guildId: interaction.guild_id,
      channelId: interaction.channel_id,
      userId: interaction.member?.user?.id || interaction.user?.id,
    };

    try {
      const choices = await handler(focusedOption.value || '', context);
      return createAutocompleteResponse(choices);
    } catch (error) {
      console.error('Autocomplete handler error:', error);
      return createAutocompleteResponse([]);
    }
  }
}
