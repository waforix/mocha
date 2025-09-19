import type {
  GuildScheduledEventRecurrenceRuleFrequency,
  GuildScheduledEventRecurrenceRuleMonth,
  GuildScheduledEventRecurrenceRuleWeekday,
} from '../../../enums';
import type { Library } from '../../conversion';

export type APIGuildScheduledEventRecurrenceRule = {
  start: Date;
  end: Date | null;
  frequency: GuildScheduledEventRecurrenceRuleFrequency;
  interval: number;
  by_weekday: GuildScheduledEventRecurrenceRuleWeekday[] | null;
  by_n_weekday: { n: number; day: GuildScheduledEventRecurrenceRuleWeekday }[] | null;
  by_month: GuildScheduledEventRecurrenceRuleMonth[] | null;
  by_month_day: number[] | null;
  by_year_day: number[] | null;
};

export type GuildScheduledEventRecurrenceRule = Library<APIGuildScheduledEventRecurrenceRule>;
