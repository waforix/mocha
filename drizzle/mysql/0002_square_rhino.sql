ALTER TABLE `channel` DROP FOREIGN KEY `channel_parentId_channel_id_fk`;
--> statement-breakpoint
ALTER TABLE `messageevent` DROP FOREIGN KEY `messageevent_channelId_channel_id_fk`;
--> statement-breakpoint
ALTER TABLE `reactionevent` DROP FOREIGN KEY `reactionevent_channelId_channel_id_fk`;
--> statement-breakpoint
ALTER TABLE `voiceevent` DROP FOREIGN KEY `voiceevent_channelId_channel_id_fk`;
--> statement-breakpoint
ALTER TABLE `member` MODIFY COLUMN `id` varchar(255) NOT NULL DEFAULT '9a0e2beb-6923-4f16-8b20-23d4ea43fa75';--> statement-breakpoint
ALTER TABLE `memberevent` MODIFY COLUMN `id` varchar(255) NOT NULL DEFAULT '44488cc7-9404-4c1f-b1e3-fe1dff7e4faf';--> statement-breakpoint
ALTER TABLE `presenceevent` MODIFY COLUMN `id` varchar(255) NOT NULL DEFAULT 'db91bf18-3106-4d5c-9afc-511440b57db6';--> statement-breakpoint
ALTER TABLE `reactionevent` MODIFY COLUMN `id` varchar(255) NOT NULL DEFAULT '9af2a758-eea9-4ce1-8cca-e3f2edf7b50c';--> statement-breakpoint
ALTER TABLE `voiceevent` MODIFY COLUMN `id` varchar(255) NOT NULL DEFAULT '4ae8fe32-1aa6-4b7c-860b-e67de9683d20';