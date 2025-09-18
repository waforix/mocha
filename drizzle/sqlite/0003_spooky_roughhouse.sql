PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_channel` (
	`id` text PRIMARY KEY NOT NULL,
	`guildId` text NOT NULL,
	`name` text,
	`type` integer NOT NULL,
	`parentId` text,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_channel`("id", "guildId", "name", "type", "parentId", "createdAt") SELECT "id", "guildId", "name", "type", "parentId", "createdAt" FROM `channel`;--> statement-breakpoint
DROP TABLE `channel`;--> statement-breakpoint
ALTER TABLE `__new_channel` RENAME TO `channel`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_messageevent` (
	`timestamp` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`guildId` text NOT NULL,
	`channelId` text NOT NULL,
	`userId` text NOT NULL,
	`content` text NOT NULL,
	`attachmentCount` integer DEFAULT 0 NOT NULL,
	`embedCount` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_messageevent`("timestamp", "createdAt", "id", "guildId", "channelId", "userId", "content", "attachmentCount", "embedCount") SELECT "timestamp", "createdAt", "id", "guildId", "channelId", "userId", "content", "attachmentCount", "embedCount" FROM `messageevent`;--> statement-breakpoint
DROP TABLE `messageevent`;--> statement-breakpoint
ALTER TABLE `__new_messageevent` RENAME TO `messageevent`;--> statement-breakpoint
CREATE TABLE `__new_reactionevent` (
	`timestamp` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`id` text PRIMARY KEY DEFAULT '39f922ec-d135-47df-ab1c-cf591f971451' NOT NULL,
	`guildId` text NOT NULL,
	`channelId` text NOT NULL,
	`messageId` text NOT NULL,
	`userId` text NOT NULL,
	`emojiId` text,
	`emojiName` text NOT NULL,
	`emojiAnimated` integer DEFAULT 0 NOT NULL,
	`action` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_reactionevent`("timestamp", "createdAt", "id", "guildId", "channelId", "messageId", "userId", "emojiId", "emojiName", "emojiAnimated", "action") SELECT "timestamp", "createdAt", "id", "guildId", "channelId", "messageId", "userId", "emojiId", "emojiName", "emojiAnimated", "action" FROM `reactionevent`;--> statement-breakpoint
DROP TABLE `reactionevent`;--> statement-breakpoint
ALTER TABLE `__new_reactionevent` RENAME TO `reactionevent`;--> statement-breakpoint
CREATE TABLE `__new_voiceevent` (
	`timestamp` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`id` text PRIMARY KEY DEFAULT 'dea4d482-299e-4de8-81f1-1c83ecaed929' NOT NULL,
	`guildId` text NOT NULL,
	`channelId` text,
	`userId` text NOT NULL,
	`action` text NOT NULL,
	`duration` integer,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_voiceevent`("timestamp", "createdAt", "id", "guildId", "channelId", "userId", "action", "duration") SELECT "timestamp", "createdAt", "id", "guildId", "channelId", "userId", "action", "duration" FROM `voiceevent`;--> statement-breakpoint
DROP TABLE `voiceevent`;--> statement-breakpoint
ALTER TABLE `__new_voiceevent` RENAME TO `voiceevent`;--> statement-breakpoint
CREATE TABLE `__new_member` (
	`id` text PRIMARY KEY DEFAULT 'c0379499-7802-4152-9c4b-03a80eb0f847' NOT NULL,
	`guildId` text NOT NULL,
	`userId` text NOT NULL,
	`nick` text,
	`joinedAt` integer NOT NULL,
	`leftAt` integer,
	`roles` text NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_member`("id", "guildId", "userId", "nick", "joinedAt", "leftAt", "roles", "createdAt") SELECT "id", "guildId", "userId", "nick", "joinedAt", "leftAt", "roles", "createdAt" FROM `member`;--> statement-breakpoint
DROP TABLE `member`;--> statement-breakpoint
ALTER TABLE `__new_member` RENAME TO `member`;--> statement-breakpoint
CREATE TABLE `__new_memberevent` (
	`timestamp` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`id` text PRIMARY KEY DEFAULT 'e2b671e0-bda3-45aa-8c22-12298289c62a' NOT NULL,
	`guildId` text NOT NULL,
	`userId` text NOT NULL,
	`action` text NOT NULL,
	`roles` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_memberevent`("timestamp", "createdAt", "id", "guildId", "userId", "action", "roles") SELECT "timestamp", "createdAt", "id", "guildId", "userId", "action", "roles" FROM `memberevent`;--> statement-breakpoint
DROP TABLE `memberevent`;--> statement-breakpoint
ALTER TABLE `__new_memberevent` RENAME TO `memberevent`;--> statement-breakpoint
CREATE TABLE `__new_presenceevent` (
	`timestamp` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`id` text PRIMARY KEY DEFAULT '8608e8f2-d088-4e75-a7f3-58d53d7ba89c' NOT NULL,
	`guildId` text NOT NULL,
	`userId` text NOT NULL,
	`status` text NOT NULL,
	`activity` text,
	`activityType` integer,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_presenceevent`("timestamp", "createdAt", "id", "guildId", "userId", "status", "activity", "activityType") SELECT "timestamp", "createdAt", "id", "guildId", "userId", "status", "activity", "activityType" FROM `presenceevent`;--> statement-breakpoint
DROP TABLE `presenceevent`;--> statement-breakpoint
ALTER TABLE `__new_presenceevent` RENAME TO `presenceevent`;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`username` text NOT NULL,
	`discriminator` text NOT NULL,
	`avatar` text,
	`bot` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "createdAt", "updatedAt", "username", "discriminator", "avatar", "bot") SELECT "id", "createdAt", "updatedAt", "username", "discriminator", "avatar", "bot" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;