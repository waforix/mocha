import type { Library } from '../../conversion';

/**@description
 * Holographic Style
 * Primary Color = 11127295,
 * Secondary Color = 16759788,
 * Tertiary Color = 16761760
 */
export type APIRoleColors = {
  primary_color: number;
  secondary_color: number | null;
  tertiary_color: number | null;
};

export type RoleColors = Library<APIRoleColors>;
