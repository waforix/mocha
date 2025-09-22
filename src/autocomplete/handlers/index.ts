import type { AutocompleteChoice, AutocompleteContext } from '../types';

export function createAsyncChoicesHandler(
  fetchFn: (guildId: string, query: string) => Promise<Array<{ name: string; value: string }>>
) {
  return async (query: string, context: AutocompleteContext): Promise<AutocompleteChoice[]> => {
    if (!context.guildId) return [];

    try {
      const results = await fetchFn(context.guildId, query);
      return results.map((result) => ({
        name: result.name,
        value: result.value,
      }));
    } catch (error) {
      console.error('Async choices handler error:', error);
      return [];
    }
  };
}
