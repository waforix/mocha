import type { AutocompleteChoice, AutocompleteResponse } from './types';

export function createAutocompleteResponse(choices: AutocompleteChoice[]): AutocompleteResponse {
  return {
    type: 8,
    data: {
      choices: choices.slice(0, 25),
    },
  };
}
