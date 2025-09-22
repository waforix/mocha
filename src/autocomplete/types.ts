export interface AutocompleteChoice {
  name: string;
  value: string | number;
}

export interface AutocompleteContext {
  guildId?: string;
  channelId?: string;
  userId?: string;
}

export interface AutocompleteResponse {
  type: number;
  data: {
    choices: AutocompleteChoice[];
  };
}

export type AutocompleteHandler = (
  query: string,
  context: AutocompleteContext
) => Promise<AutocompleteChoice[]> | AutocompleteChoice[];

export interface AutocompleteRegistration {
  commandName: string;
  optionName: string;
  handler: AutocompleteHandler;
}
