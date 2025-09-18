PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_channel` (
	`id` text PRIMARY KEY NOT NULL,
	`guildId` text NOT NULL,
	`name` text,
	`type` integer NOT NULL,
	`parentId` text,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parentId`) REFERENCES `channel`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_channel`("id", "guildId", "name", "type", "parentId", "createdAt") SELECT "id", "guildId", "name", "type", "parentId", "createdAt" FROM `channel`;--> statement-breakpoint
DROP TABLE `channel`;--> statement-breakpoint
ALTER TABLE `__new_channel` RENAME TO `channel`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_guild` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`name` text NOT NULL,
	`icon` text,
	`ownerId` text NOT NULL,
	`memberCount` integer,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_guild`("id", "createdAt", "updatedAt", "name", "icon", "ownerId", "memberCount") SELECT "id", "createdAt", "updatedAt", "name", "icon", "ownerId", "memberCount" FROM `guild`;--> statement-breakpoint
DROP TABLE `guild`;--> statement-breakpoint
ALTER TABLE `__new_guild` RENAME TO `guild`;--> statement-breakpoint
CREATE TABLE `__new_member` (
	`id` text PRIMARY KEY DEFAULT '24cd0fa2-9e46-4f8d-83d9-7d6b751c64d6' NOT NULL,
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
	`id` text PRIMARY KEY DEFAULT '3a0cb706-6296-4c26-9b92-cf3448a37b20' NOT NULL,
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
	FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_messageevent`("timestamp", "createdAt", "id", "guildId", "channelId", "userId", "content", "attachmentCount", "embedCount") SELECT "timestamp", "createdAt", "id", "guildId", "channelId", "userId", "content", "attachmentCount", "embedCount" FROM `messageevent`;--> statement-breakpoint
DROP TABLE `messageevent`;--> statement-breakpoint
ALTER TABLE `__new_messageevent` RENAME TO `messageevent`;--> statement-breakpoint
CREATE TABLE `__new_presenceevent` (
	`timestamp` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`id` text PRIMARY KEY DEFAULT '7c682d5a-3b14-41bb-b725-49c6c241c330' NOT NULL,
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
CREATE TABLE `__new_reactionevent` (
	`timestamp` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`id` text PRIMARY KEY DEFAULT 'dce17bf1-0f25-418e-8d1c-5ee6a1a90aba' NOT NULL,
	`guildId` text NOT NULL,
	`channelId` text NOT NULL,
	`messageId` text NOT NULL,
	`userId` text NOT NULL,
	`emojiId` text,
	`emojiName` text NOT NULL,
	`emojiAnimated` integer DEFAULT false NOT NULL,
	`action` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_reactionevent`("timestamp", "createdAt", "id", "guildId", "channelId", "messageId", "userId", "emojiId", "emojiName", "emojiAnimated", "action") SELECT "timestamp", "createdAt", "id", "guildId", "channelId", "messageId", "userId", "emojiId", "emojiName", "emojiAnimated", "action" FROM `reactionevent`;--> statement-breakpoint
DROP TABLE `reactionevent`;--> statement-breakpoint
ALTER TABLE `__new_reactionevent` RENAME TO `reactionevent`;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`username` text NOT NULL,
	`discriminator` text NOT NULL,
	`avatar` text,
	`bot` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "createdAt", "updatedAt", "username", "discriminator", "avatar", "bot") SELECT "id", "createdAt", "updatedAt", "username", "discriminator", "avatar", "bot" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
CREATE TABLE `__new_voiceevent` (
	`timestamp` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`id` text PRIMARY KEY DEFAULT '3ccfc185-a085-404f-a224-e9112ff16d04' NOT NULL,
	`guildId` text NOT NULL,
	`channelId` text,
	`userId` text NOT NULL,
	`action` text NOT NULL,
	`duration` integer,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_voiceevent`("timestamp", "createdAt", "id", "guildId", "channelId", "userId", "action", "duration") SELECT "timestamp", "createdAt", "id", "guildId", "channelId", "userId", "action", "duration" FROM `voiceevent`;--> statement-breakpoint
DROP TABLE `voiceevent`;--> statement-breakpoint
ALTER TABLE `__new_voiceevent` RENAME TO `voiceevent`;