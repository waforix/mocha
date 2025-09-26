import type { StatusType } from '../../../enums/presence';
import type { Library } from '../../conversion';

export type APIClientStatus = {
  desktop?: StatusType;
  mobile?: StatusType;
  web?: StatusType;
  embedded?: StatusType;
};

export type ClientStatus = Library<APIClientStatus>;
