import { schema } from '../db/index';
import { BaseProcessor } from './base';

interface RoleData {
  id: string;
  guild_id: string;
  name: string;
  color: number;
  permissions: string;
  position: number;
  hoist?: boolean;
  mentionable?: boolean;
  managed?: boolean;
}

export class RoleProcessor extends BaseProcessor<RoleData> {
  async process(data: RoleData): Promise<void> {
    if (!this.validateRoleData(data)) {
      return;
    }

    try {
      await this.processUpdate(data);
    } catch (error) {
      throw new Error(`Failed to process role: ${error}`);
    }
  }

  async processCreate(data: RoleData): Promise<void> {
    if (!this.validateRoleData(data)) {
      return;
    }

    try {
      await this.db.insert(schema.roleEvents).values({
        guildId: data.guild_id,
        roleId: data.id,
        action: 'create',
        name: data.name,
        color: data.color,
        permissions: data.permissions,
        position: data.position,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process role create: ${error}`);
    }
  }

  async processUpdate(data: RoleData): Promise<void> {
    if (!this.validateRoleData(data)) {
      return;
    }

    try {
      await this.db.insert(schema.roleEvents).values({
        guildId: data.guild_id,
        roleId: data.id,
        action: 'update',
        name: data.name,
        color: data.color,
        permissions: data.permissions,
        position: data.position,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process role update: ${error}`);
    }
  }

  async processDelete(data: { id: string; guild_id: string }): Promise<void> {
    if (!data.id || !data.guild_id) {
      return;
    }

    try {
      await this.db.insert(schema.roleEvents).values({
        guildId: data.guild_id,
        roleId: data.id,
        action: 'delete',
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process role delete: ${error}`);
    }
  }

  private validateRoleData(data: unknown): data is RoleData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const d = data as Record<string, unknown>;

    return !!(
      d.id &&
      typeof d.id === 'string' &&
      d.guild_id &&
      typeof d.guild_id === 'string' &&
      d.name &&
      typeof d.name === 'string' &&
      typeof d.color === 'number' &&
      d.permissions &&
      typeof d.permissions === 'string' &&
      typeof d.position === 'number'
    );
  }
}
