import type { SafetyWarningType } from '../../../enums/channel';
import type { Library } from '../../conversion';

export type APISafetyWarning = {
  id: string;
  type: SafetyWarningType;
};

export type SafetyWarning = Library<APISafetyWarning>;
