import type { InviteTargetType } from "../../../enums";
import type { Application, User } from "../../api";

export type InviteCreate = {
    channel_id: string;
    code: string;
    created_at: Date;
    guild_id?: string;
    invited?: User;
    max_age: number;
    max_uses: number;
    target_type?: InviteTargetType;
    target_user?: User;
    target_application?: Partial<Application>;
    temporary: boolean;
    uses: number;
    expires_at: Date;
}