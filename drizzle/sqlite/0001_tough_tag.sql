CREATE TABLE `channel` (
	`id` text PRIMARY KEY NOT NULL,
	`guildId` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`parentId` text NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parentId`) REFERENCES `channel`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `guild` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`ownerId` text NOT NULL,
	`memberCount` text NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `member` (
	`id` text PRIMARY KEY DEFAULT 'f38d21db-c9ea-412e-9816-4c710a4087b9' NOT NULL,
	`guildId` text NOT NULL,
	`userId` text NOT NULL,
	`nick` text NOT NULL,
	`joinedAt` text NOT NULL,
	`leftAt` text NOT NULL,
	`roles` text NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `memberevent` (
	`timestamp` text NOT NULL,
	`createdAt` text NOT NULL,
	`id` text PRIMARY KEY DEFAULT 'f21cd90a-717b-4736-a4da-68c7da0e7979' NOT NULL,
	`guildId` text NOT NULL,
	`userId` text NOT NULL,
	`action` text NOT NULL,
	`roles` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `messageevent` (
	`timestamp` text NOT NULL,
	`createdAt` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`guildId` text NOT NULL,
	`channelId` text NOT NULL,
	`userId` text NOT NULL,
	`content` text NOT NULL,
	`attachmentCount` text DEFAULT 0 NOT NULL,
	`embedCount` text DEFAULT 0 NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `presenceevent` (
	`timestamp` text NOT NULL,
	`createdAt` text NOT NULL,
	`id` text PRIMARY KEY DEFAULT 'acc74ed4-d047-4574-94d4-fb3ca10d84d3' NOT NULL,
	`guildId` text NOT NULL,
	`userId` text NOT NULL,
	`status` text NOT NULL,
	`activity` text NOT NULL,
	`activityType` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reactionevent` (
	`timestamp` text NOT NULL,
	`createdAt` text NOT NULL,
	`id` text PRIMARY KEY DEFAULT 'a1dbd6a8-2c72-46b9-9166-3d0a77ee1e93' NOT NULL,
	`guildId` text NOT NULL,
	`channelId` text NOT NULL,
	`messageId` text NOT NULL,
	`userId` text NOT NULL,
	`emojiId` text NOT NULL,
	`emojiName` text NOT NULL,
	`emojiAnimated` text DEFAULT false NOT NULL,
	`action` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	`username` text NOT NULL,
	`discriminator` text NOT NULL,
	`avatar` text NOT NULL,
	`bot` text DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `voiceevent` (
	`timestamp` text NOT NULL,
	`createdAt` text NOT NULL,
	`id` text PRIMARY KEY DEFAULT '27b9bb87-ea33-40d7-9848-4a7fd93ff2e2' NOT NULL,
	`guildId` text NOT NULL,
	`channelId` text NOT NULL,
	`userId` text NOT NULL,
	`action` text NOT NULL,
	`duration` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `member_events`;--> statement-breakpoint
DROP TABLE `message_events`;--> statement-breakpoint
DROP TABLE `presence_events`;--> statement-breakpoint
DROP TABLE `reaction_events`;--> statement-breakpoint
DROP TABLE `voice_events`;--> statement-breakpoint
DROP TABLE `channels`;--> statement-breakpoint
DROP TABLE `guilds`;--> statement-breakpoint
DROP TABLE `members`;--> statement-breakpoint
DROP TABLE `users`;