CREATE TABLE `auto_moderation_events` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`rule_id` text NOT NULL,
	`action` text NOT NULL,
	`user_id` text,
	`channel_id` text,
	`message_id` text,
	`rule_name` text,
	`trigger_type` integer,
	`action_type` integer,
	`content` text,
	`timestamp` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `auto_mod_guild_idx` ON `auto_moderation_events` (`guild_id`);--> statement-breakpoint
CREATE INDEX `auto_mod_rule_idx` ON `auto_moderation_events` (`rule_id`);--> statement-breakpoint
CREATE INDEX `auto_mod_user_idx` ON `auto_moderation_events` (`user_id`);--> statement-breakpoint
CREATE INDEX `auto_mod_timestamp_idx` ON `auto_moderation_events` (`timestamp`);--> statement-breakpoint
CREATE TABLE `channel_events` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`channel_id` text NOT NULL,
	`action` text NOT NULL,
	`channel_type` integer NOT NULL,
	`name` text,
	`parent_id` text,
	`thread_id` text,
	`is_thread` integer DEFAULT false,
	`thread_metadata` text,
	`timestamp` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `channel_guild_idx` ON `channel_events` (`guild_id`);--> statement-breakpoint
CREATE INDEX `channel_channel_idx` ON `channel_events` (`channel_id`);--> statement-breakpoint
CREATE INDEX `channel_timestamp_idx` ON `channel_events` (`timestamp`);--> statement-breakpoint
CREATE INDEX `channel_thread_idx` ON `channel_events` (`thread_id`);--> statement-breakpoint
CREATE TABLE `guild_events` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`action` text NOT NULL,
	`target_user_id` text,
	`reason` text,
	`changes` text,
	`timestamp` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `guild_event_guild_idx` ON `guild_events` (`guild_id`);--> statement-breakpoint
CREATE INDEX `guild_event_target_user_idx` ON `guild_events` (`target_user_id`);--> statement-breakpoint
CREATE INDEX `guild_event_timestamp_idx` ON `guild_events` (`timestamp`);--> statement-breakpoint
CREATE TABLE `interaction_events` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text,
	`channel_id` text,
	`user_id` text NOT NULL,
	`interaction_type` integer NOT NULL,
	`command_name` text,
	`custom_id` text,
	`thread_id` text,
	`parent_channel_id` text,
	`timestamp` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `interaction_guild_idx` ON `interaction_events` (`guild_id`);--> statement-breakpoint
CREATE INDEX `interaction_user_idx` ON `interaction_events` (`user_id`);--> statement-breakpoint
CREATE INDEX `interaction_timestamp_idx` ON `interaction_events` (`timestamp`);--> statement-breakpoint
CREATE INDEX `interaction_thread_idx` ON `interaction_events` (`thread_id`);--> statement-breakpoint
CREATE TABLE `invite_events` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`channel_id` text,
	`invite_code` text NOT NULL,
	`inviter_id` text,
	`action` text NOT NULL,
	`max_age` integer,
	`max_uses` integer,
	`temporary` integer DEFAULT false,
	`timestamp` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`inviter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `invite_guild_idx` ON `invite_events` (`guild_id`);--> statement-breakpoint
CREATE INDEX `invite_inviter_idx` ON `invite_events` (`inviter_id`);--> statement-breakpoint
CREATE INDEX `invite_timestamp_idx` ON `invite_events` (`timestamp`);--> statement-breakpoint
CREATE TABLE `role_events` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`role_id` text NOT NULL,
	`action` text NOT NULL,
	`name` text,
	`color` integer,
	`permissions` text,
	`position` integer,
	`timestamp` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `role_guild_idx` ON `role_events` (`guild_id`);--> statement-breakpoint
CREATE INDEX `role_role_idx` ON `role_events` (`role_id`);--> statement-breakpoint
CREATE INDEX `role_timestamp_idx` ON `role_events` (`timestamp`);--> statement-breakpoint
CREATE TABLE `scheduled_events` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`event_id` text NOT NULL,
	`action` text NOT NULL,
	`user_id` text,
	`name` text,
	`description` text,
	`scheduled_start_time` integer,
	`scheduled_end_time` integer,
	`entity_type` integer,
	`status` integer,
	`timestamp` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `scheduled_event_guild_idx` ON `scheduled_events` (`guild_id`);--> statement-breakpoint
CREATE INDEX `scheduled_event_event_idx` ON `scheduled_events` (`event_id`);--> statement-breakpoint
CREATE INDEX `scheduled_event_user_idx` ON `scheduled_events` (`user_id`);--> statement-breakpoint
CREATE INDEX `scheduled_event_timestamp_idx` ON `scheduled_events` (`timestamp`);--> statement-breakpoint
ALTER TABLE `message_events` ADD `thread_id` text;--> statement-breakpoint
ALTER TABLE `message_events` ADD `parent_channel_id` text;--> statement-breakpoint
ALTER TABLE `message_events` ADD `message_type` integer DEFAULT 0;--> statement-breakpoint
CREATE INDEX `msg_thread_idx` ON `message_events` (`thread_id`);--> statement-breakpoint
CREATE INDEX `msg_parent_channel_idx` ON `message_events` (`parent_channel_id`);--> statement-breakpoint
ALTER TABLE `reaction_events` ADD `thread_id` text;--> statement-breakpoint
ALTER TABLE `reaction_events` ADD `parent_channel_id` text;--> statement-breakpoint
CREATE INDEX `reaction_thread_idx` ON `reaction_events` (`thread_id`);