ALTER TABLE "channel" DROP CONSTRAINT "channel_parentId_channel_id_fk";
--> statement-breakpoint
ALTER TABLE "messageevent" DROP CONSTRAINT "messageevent_channelId_channel_id_fk";
--> statement-breakpoint
ALTER TABLE "reactionevent" DROP CONSTRAINT "reactionevent_channelId_channel_id_fk";
--> statement-breakpoint
ALTER TABLE "voiceevent" DROP CONSTRAINT "voiceevent_channelId_channel_id_fk";
--> statement-breakpoint
ALTER TABLE "member" ALTER COLUMN "id" SET DEFAULT 'b9802d39-88ee-41b5-ac89-b3bb41146dc9';--> statement-breakpoint
ALTER TABLE "memberevent" ALTER COLUMN "id" SET DEFAULT '8f6339d4-8f02-4727-8e79-5b90f9b2b7ea';--> statement-breakpoint
ALTER TABLE "presenceevent" ALTER COLUMN "id" SET DEFAULT '41ab2aee-8bbf-4783-a6b1-d47fb1c2b145';--> statement-breakpoint
ALTER TABLE "reactionevent" ALTER COLUMN "id" SET DEFAULT '8bf01b2f-8195-4415-a5cd-7cf25821f952';--> statement-breakpoint
ALTER TABLE "voiceevent" ALTER COLUMN "id" SET DEFAULT 'f3b1061f-a145-48d4-b526-8ec62e1ba39b';