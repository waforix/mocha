ALTER TABLE `channel` MODIFY COLUMN `name` varchar(255);--> statement-breakpoint
ALTER TABLE `channel` MODIFY COLUMN `type` int NOT NULL;--> statement-breakpoint
ALTER TABLE `channel` MODIFY COLUMN `parentId` varchar(255);--> statement-breakpoint
ALTER TABLE `channel` MODIFY COLUMN `createdAt` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `guild` MODIFY COLUMN `createdAt` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `guild` MODIFY COLUMN `updatedAt` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `guild` MODIFY COLUMN `icon` varchar(255);--> statement-breakpoint
ALTER TABLE `guild` MODIFY COLUMN `memberCount` int;--> statement-breakpoint
ALTER TABLE `member` MODIFY COLUMN `id` varchar(255) NOT NULL DEFAULT '2138a723-3c1b-4127-b5b3-89ab5ef87670';--> statement-breakpoint
ALTER TABLE `member` MODIFY COLUMN `nick` varchar(255);--> statement-breakpoint
ALTER TABLE `member` MODIFY COLUMN `joinedAt` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `member` MODIFY COLUMN `leftAt` timestamp;--> statement-breakpoint
ALTER TABLE `member` MODIFY COLUMN `roles` text NOT NULL;--> statement-breakpoint
ALTER TABLE `member` MODIFY COLUMN `createdAt` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `memberevent` MODIFY COLUMN `timestamp` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `memberevent` MODIFY COLUMN `createdAt` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `memberevent` MODIFY COLUMN `id` varchar(255) NOT NULL DEFAULT 'f858b477-c70f-40b6-a129-57de5709a93a';--> statement-breakpoint
ALTER TABLE `memberevent` MODIFY COLUMN `roles` text NOT NULL;--> statement-breakpoint
ALTER TABLE `messageevent` MODIFY COLUMN `timestamp` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `messageevent` MODIFY COLUMN `createdAt` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `messageevent` MODIFY COLUMN `attachmentCount` int NOT NULL;--> statement-breakpoint
ALTER TABLE `messageevent` MODIFY COLUMN `embedCount` int NOT NULL;--> statement-breakpoint
ALTER TABLE `presenceevent` MODIFY COLUMN `timestamp` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `presenceevent` MODIFY COLUMN `createdAt` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `presenceevent` MODIFY COLUMN `id` varchar(255) NOT NULL DEFAULT 'f997d226-d736-4b3b-82c5-004c1183431e';--> statement-breakpoint
ALTER TABLE `presenceevent` MODIFY COLUMN `activity` varchar(255);--> statement-breakpoint
ALTER TABLE `presenceevent` MODIFY COLUMN `activityType` int;--> statement-breakpoint
ALTER TABLE `reactionevent` MODIFY COLUMN `timestamp` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `reactionevent` MODIFY COLUMN `createdAt` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `reactionevent` MODIFY COLUMN `id` varchar(255) NOT NULL DEFAULT 'bacdb585-207b-4995-8ebc-7391ac0657bf';--> statement-breakpoint
ALTER TABLE `reactionevent` MODIFY COLUMN `emojiId` varchar(255);--> statement-breakpoint
ALTER TABLE `reactionevent` MODIFY COLUMN `emojiAnimated` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `createdAt` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `updatedAt` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `avatar` varchar(255);--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `bot` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `voiceevent` MODIFY COLUMN `timestamp` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `voiceevent` MODIFY COLUMN `createdAt` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `voiceevent` MODIFY COLUMN `id` varchar(255) NOT NULL DEFAULT '16bd48be-374d-4e2c-b14d-c62ba03ea823';--> statement-breakpoint
ALTER TABLE `voiceevent` MODIFY COLUMN `channelId` varchar(255);--> statement-breakpoint
ALTER TABLE `voiceevent` MODIFY COLUMN `duration` int;