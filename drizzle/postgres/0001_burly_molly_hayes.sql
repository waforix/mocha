ALTER TABLE "channel" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "channel" ALTER COLUMN "type" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "channel" ALTER COLUMN "parentId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "channel" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "guild" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "guild" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "guild" ALTER COLUMN "icon" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "guild" ALTER COLUMN "memberCount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "guild" ALTER COLUMN "memberCount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "member" ALTER COLUMN "id" SET DEFAULT 'dba6a3ee-9c1d-468c-b5b5-c787660b3db5';--> statement-breakpoint
ALTER TABLE "member" ALTER COLUMN "nick" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "member" ALTER COLUMN "joinedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "member" ALTER COLUMN "leftAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "member" ALTER COLUMN "leftAt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "member" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "memberevent" ALTER COLUMN "timestamp" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "memberevent" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "memberevent" ALTER COLUMN "id" SET DEFAULT '37378f10-62f5-4ada-9760-b15e0c0494b6';--> statement-breakpoint
ALTER TABLE "messageevent" ALTER COLUMN "timestamp" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "messageevent" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "messageevent" ALTER COLUMN "attachmentCount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "messageevent" ALTER COLUMN "embedCount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "presenceevent" ALTER COLUMN "timestamp" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "presenceevent" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "presenceevent" ALTER COLUMN "id" SET DEFAULT 'ba29fa04-0fee-4497-ba1a-0b5200775786';--> statement-breakpoint
ALTER TABLE "presenceevent" ALTER COLUMN "activity" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "presenceevent" ALTER COLUMN "activityType" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "presenceevent" ALTER COLUMN "activityType" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reactionevent" ALTER COLUMN "timestamp" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reactionevent" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reactionevent" ALTER COLUMN "id" SET DEFAULT 'e241404d-6c1f-49f8-bf22-e7da805b5aef';--> statement-breakpoint
ALTER TABLE "reactionevent" ALTER COLUMN "emojiId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reactionevent" ALTER COLUMN "emojiAnimated" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "avatar" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "bot" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "voiceevent" ALTER COLUMN "timestamp" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "voiceevent" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "voiceevent" ALTER COLUMN "id" SET DEFAULT '62af5eee-ff25-47d5-b8ba-d3564d4079ff';--> statement-breakpoint
ALTER TABLE "voiceevent" ALTER COLUMN "channelId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "voiceevent" ALTER COLUMN "duration" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "voiceevent" ALTER COLUMN "duration" DROP NOT NULL;