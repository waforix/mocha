CREATE TABLE `channel` (
	`id` varchar(255) NOT NULL,
	`guildId` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`parentId` varchar(255) NOT NULL,
	`createdAt` varchar(255) NOT NULL,
	CONSTRAINT `channel_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guild` (
	`id` varchar(255) NOT NULL,
	`createdAt` varchar(255) NOT NULL,
	`updatedAt` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`icon` varchar(255) NOT NULL,
	`ownerId` varchar(255) NOT NULL,
	`memberCount` varchar(255) NOT NULL,
	CONSTRAINT `guild_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `member` (
	`id` varchar(255) NOT NULL DEFAULT 'a362aa89-3640-403b-b8d2-f49951342cbe',
	`guildId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`nick` varchar(255) NOT NULL,
	`joinedAt` varchar(255) NOT NULL,
	`leftAt` varchar(255) NOT NULL,
	`roles` varchar(255) NOT NULL,
	`createdAt` varchar(255) NOT NULL,
	CONSTRAINT `member_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memberevent` (
	`timestamp` varchar(255) NOT NULL,
	`createdAt` varchar(255) NOT NULL,
	`id` varchar(255) NOT NULL DEFAULT '7d8fad7b-c699-4db8-a8da-3b04b04d7b79',
	`guildId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`action` varchar(255) NOT NULL,
	`roles` varchar(255) NOT NULL,
	CONSTRAINT `memberevent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messageevent` (
	`timestamp` varchar(255) NOT NULL,
	`createdAt` varchar(255) NOT NULL,
	`id` varchar(255) NOT NULL,
	`guildId` varchar(255) NOT NULL,
	`channelId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`content` varchar(255) NOT NULL,
	`attachmentCount` varchar(255) NOT NULL DEFAULT 0,
	`embedCount` varchar(255) NOT NULL DEFAULT 0,
	CONSTRAINT `messageevent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `presenceevent` (
	`timestamp` varchar(255) NOT NULL,
	`createdAt` varchar(255) NOT NULL,
	`id` varchar(255) NOT NULL DEFAULT '14448870-e18e-4334-ab09-1272ce18c097',
	`guildId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`status` varchar(255) NOT NULL,
	`activity` varchar(255) NOT NULL,
	`activityType` varchar(255) NOT NULL,
	CONSTRAINT `presenceevent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reactionevent` (
	`timestamp` varchar(255) NOT NULL,
	`createdAt` varchar(255) NOT NULL,
	`id` varchar(255) NOT NULL DEFAULT '101de204-1df6-433c-a4f8-a72c8ea78104',
	`guildId` varchar(255) NOT NULL,
	`channelId` varchar(255) NOT NULL,
	`messageId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`emojiId` varchar(255) NOT NULL,
	`emojiName` varchar(255) NOT NULL,
	`emojiAnimated` varchar(255) NOT NULL DEFAULT false,
	`action` varchar(255) NOT NULL,
	CONSTRAINT `reactionevent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`createdAt` varchar(255) NOT NULL,
	`updatedAt` varchar(255) NOT NULL,
	`username` varchar(255) NOT NULL,
	`discriminator` varchar(255) NOT NULL,
	`avatar` varchar(255) NOT NULL,
	`bot` varchar(255) NOT NULL DEFAULT false,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `voiceevent` (
	`timestamp` varchar(255) NOT NULL,
	`createdAt` varchar(255) NOT NULL,
	`id` varchar(255) NOT NULL DEFAULT '5ab45cec-2b5c-41af-93a3-f2c65bda590d',
	`guildId` varchar(255) NOT NULL,
	`channelId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`action` varchar(255) NOT NULL,
	`duration` varchar(255) NOT NULL,
	CONSTRAINT `voiceevent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `channel` ADD CONSTRAINT `channel_guildId_guild_id_fk` FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `channel` ADD CONSTRAINT `channel_parentId_channel_id_fk` FOREIGN KEY (`parentId`) REFERENCES `channel`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guild` ADD CONSTRAINT `guild_ownerId_user_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `member` ADD CONSTRAINT `member_guildId_guild_id_fk` FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `member` ADD CONSTRAINT `member_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `memberevent` ADD CONSTRAINT `memberevent_guildId_guild_id_fk` FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `memberevent` ADD CONSTRAINT `memberevent_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messageevent` ADD CONSTRAINT `messageevent_guildId_guild_id_fk` FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messageevent` ADD CONSTRAINT `messageevent_channelId_channel_id_fk` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messageevent` ADD CONSTRAINT `messageevent_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presenceevent` ADD CONSTRAINT `presenceevent_guildId_guild_id_fk` FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presenceevent` ADD CONSTRAINT `presenceevent_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reactionevent` ADD CONSTRAINT `reactionevent_guildId_guild_id_fk` FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reactionevent` ADD CONSTRAINT `reactionevent_channelId_channel_id_fk` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reactionevent` ADD CONSTRAINT `reactionevent_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `voiceevent` ADD CONSTRAINT `voiceevent_guildId_guild_id_fk` FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `voiceevent` ADD CONSTRAINT `voiceevent_channelId_channel_id_fk` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `voiceevent` ADD CONSTRAINT `voiceevent_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;