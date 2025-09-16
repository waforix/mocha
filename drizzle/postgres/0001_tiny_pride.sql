CREATE TABLE "auto_moderation_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" text NOT NULL,
	"rule_id" text NOT NULL,
	"action" text NOT NULL,
	"user_id" text,
	"channel_id" text,
	"message_id" text,
	"rule_name" text,
	"trigger_type" integer,
	"action_type" integer,
	"content" text,
	"timestamp" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "channel_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" text NOT NULL,
	"channel_id" text NOT NULL,
	"action" text NOT NULL,
	"channel_type" integer NOT NULL,
	"name" text,
	"parent_id" text,
	"thread_id" text,
	"is_thread" integer DEFAULT 0,
	"thread_metadata" text,
	"timestamp" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guild_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" text NOT NULL,
	"action" text NOT NULL,
	"target_user_id" text,
	"reason" text,
	"changes" text,
	"timestamp" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interaction_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" text,
	"channel_id" text,
	"user_id" text NOT NULL,
	"interaction_type" integer NOT NULL,
	"command_name" text,
	"custom_id" text,
	"thread_id" text,
	"parent_channel_id" text,
	"timestamp" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invite_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" text NOT NULL,
	"channel_id" text,
	"invite_code" text NOT NULL,
	"inviter_id" text,
	"action" text NOT NULL,
	"max_age" integer,
	"max_uses" integer,
	"temporary" integer DEFAULT 0,
	"timestamp" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" text NOT NULL,
	"role_id" text NOT NULL,
	"action" text NOT NULL,
	"name" text,
	"color" integer,
	"permissions" text,
	"position" integer,
	"timestamp" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduled_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" text NOT NULL,
	"event_id" text NOT NULL,
	"action" text NOT NULL,
	"user_id" text,
	"name" text,
	"description" text,
	"scheduled_start_time" timestamp with time zone,
	"scheduled_end_time" timestamp with time zone,
	"entity_type" integer,
	"status" integer,
	"timestamp" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "message_events" ADD COLUMN "thread_id" text;--> statement-breakpoint
ALTER TABLE "message_events" ADD COLUMN "parent_channel_id" text;--> statement-breakpoint
ALTER TABLE "message_events" ADD COLUMN "message_type" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "reaction_events" ADD COLUMN "thread_id" text;--> statement-breakpoint
ALTER TABLE "reaction_events" ADD COLUMN "parent_channel_id" text;--> statement-breakpoint
ALTER TABLE "auto_moderation_events" ADD CONSTRAINT "auto_moderation_events_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auto_moderation_events" ADD CONSTRAINT "auto_moderation_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auto_moderation_events" ADD CONSTRAINT "auto_moderation_events_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel_events" ADD CONSTRAINT "channel_events_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guild_events" ADD CONSTRAINT "guild_events_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interaction_events" ADD CONSTRAINT "interaction_events_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interaction_events" ADD CONSTRAINT "interaction_events_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interaction_events" ADD CONSTRAINT "interaction_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invite_events" ADD CONSTRAINT "invite_events_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invite_events" ADD CONSTRAINT "invite_events_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invite_events" ADD CONSTRAINT "invite_events_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_events" ADD CONSTRAINT "role_events_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_events" ADD CONSTRAINT "scheduled_events_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_events" ADD CONSTRAINT "scheduled_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auto_mod_guild_idx" ON "auto_moderation_events" USING btree ("guild_id");--> statement-breakpoint
CREATE INDEX "auto_mod_rule_idx" ON "auto_moderation_events" USING btree ("rule_id");--> statement-breakpoint
CREATE INDEX "auto_mod_user_idx" ON "auto_moderation_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auto_mod_timestamp_idx" ON "auto_moderation_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "channel_guild_idx" ON "channel_events" USING btree ("guild_id");--> statement-breakpoint
CREATE INDEX "channel_channel_idx" ON "channel_events" USING btree ("channel_id");--> statement-breakpoint
CREATE INDEX "channel_timestamp_idx" ON "channel_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "channel_thread_idx" ON "channel_events" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "guild_event_guild_idx" ON "guild_events" USING btree ("guild_id");--> statement-breakpoint
CREATE INDEX "guild_event_target_user_idx" ON "guild_events" USING btree ("target_user_id");--> statement-breakpoint
CREATE INDEX "guild_event_timestamp_idx" ON "guild_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "interaction_guild_idx" ON "interaction_events" USING btree ("guild_id");--> statement-breakpoint
CREATE INDEX "interaction_user_idx" ON "interaction_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "interaction_timestamp_idx" ON "interaction_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "interaction_thread_idx" ON "interaction_events" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "invite_guild_idx" ON "invite_events" USING btree ("guild_id");--> statement-breakpoint
CREATE INDEX "invite_inviter_idx" ON "invite_events" USING btree ("inviter_id");--> statement-breakpoint
CREATE INDEX "invite_timestamp_idx" ON "invite_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "role_guild_idx" ON "role_events" USING btree ("guild_id");--> statement-breakpoint
CREATE INDEX "role_role_idx" ON "role_events" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "role_timestamp_idx" ON "role_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "scheduled_event_guild_idx" ON "scheduled_events" USING btree ("guild_id");--> statement-breakpoint
CREATE INDEX "scheduled_event_event_idx" ON "scheduled_events" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "scheduled_event_user_idx" ON "scheduled_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "scheduled_event_timestamp_idx" ON "scheduled_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "msg_thread_idx" ON "message_events" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "msg_parent_channel_idx" ON "message_events" USING btree ("parent_channel_id");--> statement-breakpoint
CREATE INDEX "reaction_thread_idx" ON "reaction_events" USING btree ("thread_id");