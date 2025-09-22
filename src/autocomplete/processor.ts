import type { AutocompleteChoice, AutocompleteContext, AutocompleteHandler } from './types';

export function createStaticChoices(choices: AutocompleteChoice[]): AutocompleteHandler {
  return () => choices;
}

export function createFilteredChoices(
  choices: AutocompleteChoice[],
  filterFn?: (choice: AutocompleteChoice, query: string) => boolean
): AutocompleteHandler {
  return (query: string) => {
    if (!query) return choices;

    const defaultFilter = (choice: AutocompleteChoice, q: string) =>
      choice.name.toLowerCase().includes(q.toLowerCase());

    const filter = filterFn || defaultFilter;
    return choices.filter((choice) => filter(choice, query));
  };
}

export function createAsyncChoices(
  fetchFn: (query: string, context: AutocompleteContext) => Promise<AutocompleteChoice[]>
): AutocompleteHandler {
  return async (query: string, context: AutocompleteContext) => {
    try {
      return await fetchFn(query, context);
    } catch (error) {
      console.error('Async autocomplete error:', error);
      return [];
    }
  };
}
