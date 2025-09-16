CREATE TABLE `member_events` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`roles` text DEFAULT '[]' NOT NULL,
	`timestamp` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `member_guild_idx` ON `member_events` (`guild_id`);--> statement-breakpoint
CREATE INDEX `member_user_idx` ON `member_events` (`user_id`);--> statement-breakpoint
CREATE INDEX `member_timestamp_idx` ON `member_events` (`timestamp`);--> statement-breakpoint
CREATE TABLE `message_events` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`channel_id` text NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`attachment_count` integer DEFAULT 0 NOT NULL,
	`embed_count` integer DEFAULT 0 NOT NULL,
	`timestamp` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `msg_guild_idx` ON `message_events` (`guild_id`);--> statement-breakpoint
CREATE INDEX `msg_user_idx` ON `message_events` (`user_id`);--> statement-breakpoint
CREATE INDEX `msg_timestamp_idx` ON `message_events` (`timestamp`);--> statement-breakpoint
CREATE INDEX `msg_guild_user_idx` ON `message_events` (`guild_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `presence_events` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`status` text NOT NULL,
	`activity` text,
	`activity_type` integer,
	`timestamp` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `presence_guild_idx` ON `presence_events` (`guild_id`);--> statement-breakpoint
CREATE INDEX `presence_user_idx` ON `presence_events` (`user_id`);--> statement-breakpoint
CREATE INDEX `presence_timestamp_idx` ON `presence_events` (`timestamp`);--> statement-breakpoint
CREATE TABLE `reaction_events` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`channel_id` text NOT NULL,
	`message_id` text NOT NULL,
	`user_id` text NOT NULL,
	`emoji_id` text,
	`emoji_name` text NOT NULL,
	`emoji_animated` integer DEFAULT false,
	`action` text NOT NULL,
	`timestamp` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `reaction_guild_idx` ON `reaction_events` (`guild_id`);--> statement-breakpoint
CREATE INDEX `reaction_message_idx` ON `reaction_events` (`message_id`);--> statement-breakpoint
CREATE INDEX `reaction_user_idx` ON `reaction_events` (`user_id`);--> statement-breakpoint
CREATE INDEX `reaction_timestamp_idx` ON `reaction_events` (`timestamp`);--> statement-breakpoint
CREATE TABLE `voice_events` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`channel_id` text,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`duration` integer,
	`timestamp` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `voice_guild_idx` ON `voice_events` (`guild_id`);--> statement-breakpoint
CREATE INDEX `voice_user_idx` ON `voice_events` (`user_id`);--> statement-breakpoint
CREATE INDEX `voice_timestamp_idx` ON `voice_events` (`timestamp`);--> statement-breakpoint
CREATE INDEX `voice_guild_user_idx` ON `voice_events` (`guild_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `channels` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`name` text,
	`type` integer NOT NULL,
	`parent_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `guilds` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text,
	`owner_id` text NOT NULL,
	`member_count` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`nick` text,
	`joined_at` integer NOT NULL,
	`left_at` integer,
	`roles` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`discriminator` text NOT NULL,
	`avatar` text,
	`bot` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
