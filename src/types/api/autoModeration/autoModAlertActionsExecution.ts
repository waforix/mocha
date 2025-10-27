import type { Library } from '../../conversion';
import type { APIAutoModAlertAction } from './autoModAlertAction';

export type APIAutoModAlertActionsExecution = {
  v: number;
  actions: APIAutoModAlertAction[];
};

export type AutoModAlertActionsExecution = Library<APIAutoModAlertActionsExecution>;
