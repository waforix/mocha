CREATE TABLE "member_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" text NOT NULL,
	"user_id" text NOT NULL,
	"action" text NOT NULL,
	"roles" text DEFAULT '[]' NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_events" (
	"id" text PRIMARY KEY NOT NULL,
	"guild_id" text NOT NULL,
	"channel_id" text NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"attachment_count" integer DEFAULT 0 NOT NULL,
	"embed_count" integer DEFAULT 0 NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "presence_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text NOT NULL,
	"activity" text,
	"activity_type" integer,
	"timestamp" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reaction_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" text NOT NULL,
	"channel_id" text NOT NULL,
	"message_id" text NOT NULL,
	"user_id" text NOT NULL,
	"emoji_id" text,
	"emoji_name" text NOT NULL,
	"emoji_animated" integer DEFAULT 0,
	"action" text NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voice_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" text NOT NULL,
	"channel_id" text,
	"user_id" text NOT NULL,
	"action" text NOT NULL,
	"duration" integer,
	"timestamp" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "channels" (
	"id" text PRIMARY KEY NOT NULL,
	"guild_id" text NOT NULL,
	"name" text,
	"type" integer NOT NULL,
	"parent_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guilds" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"owner_id" text NOT NULL,
	"member_count" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" text NOT NULL,
	"user_id" text NOT NULL,
	"nick" text,
	"joined_at" timestamp with time zone NOT NULL,
	"left_at" timestamp with time zone,
	"roles" text DEFAULT '[]' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"discriminator" text NOT NULL,
	"avatar" text,
	"bot" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "member_events" ADD CONSTRAINT "member_events_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_events" ADD CONSTRAINT "member_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_events" ADD CONSTRAINT "message_events_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_events" ADD CONSTRAINT "message_events_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_events" ADD CONSTRAINT "message_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presence_events" ADD CONSTRAINT "presence_events_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presence_events" ADD CONSTRAINT "presence_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reaction_events" ADD CONSTRAINT "reaction_events_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reaction_events" ADD CONSTRAINT "reaction_events_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reaction_events" ADD CONSTRAINT "reaction_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_events" ADD CONSTRAINT "voice_events_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_events" ADD CONSTRAINT "voice_events_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_events" ADD CONSTRAINT "voice_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channels" ADD CONSTRAINT "channels_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "member_guild_idx" ON "member_events" USING btree ("guild_id");--> statement-breakpoint
CREATE INDEX "member_user_idx" ON "member_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "member_timestamp_idx" ON "member_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "msg_guild_idx" ON "message_events" USING btree ("guild_id");--> statement-breakpoint
CREATE INDEX "msg_user_idx" ON "message_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "msg_timestamp_idx" ON "message_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "msg_guild_user_idx" ON "message_events" USING btree ("guild_id","user_id");--> statement-breakpoint
CREATE INDEX "presence_guild_idx" ON "presence_events" USING btree ("guild_id");--> statement-breakpoint
CREATE INDEX "presence_user_idx" ON "presence_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "presence_timestamp_idx" ON "presence_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "reaction_guild_idx" ON "reaction_events" USING btree ("guild_id");--> statement-breakpoint
CREATE INDEX "reaction_message_idx" ON "reaction_events" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "reaction_user_idx" ON "reaction_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reaction_timestamp_idx" ON "reaction_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "voice_guild_idx" ON "voice_events" USING btree ("guild_id");--> statement-breakpoint
CREATE INDEX "voice_user_idx" ON "voice_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "voice_timestamp_idx" ON "voice_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "voice_guild_user_idx" ON "voice_events" USING btree ("guild_id","user_id");