CREATE TABLE "channel" (
	"id" text PRIMARY KEY NOT NULL,
	"guildId" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"parentId" text NOT NULL,
	"createdAt" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guild" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" text NOT NULL,
	"updatedAt" text NOT NULL,
	"name" text NOT NULL,
	"icon" text NOT NULL,
	"ownerId" text NOT NULL,
	"memberCount" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY DEFAULT 'e4b3266c-d2e2-42f8-bef0-8a3c5f6128a2' NOT NULL,
	"guildId" text NOT NULL,
	"userId" text NOT NULL,
	"nick" text NOT NULL,
	"joinedAt" text NOT NULL,
	"leftAt" text NOT NULL,
	"roles" text NOT NULL,
	"createdAt" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memberevent" (
	"timestamp" text NOT NULL,
	"createdAt" text NOT NULL,
	"id" text PRIMARY KEY DEFAULT 'd956507a-28e5-4d7d-81e0-f0a3348867f2' NOT NULL,
	"guildId" text NOT NULL,
	"userId" text NOT NULL,
	"action" text NOT NULL,
	"roles" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messageevent" (
	"timestamp" text NOT NULL,
	"createdAt" text NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"guildId" text NOT NULL,
	"channelId" text NOT NULL,
	"userId" text NOT NULL,
	"content" text NOT NULL,
	"attachmentCount" text DEFAULT 0 NOT NULL,
	"embedCount" text DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "presenceevent" (
	"timestamp" text NOT NULL,
	"createdAt" text NOT NULL,
	"id" text PRIMARY KEY DEFAULT '72a84629-4ef0-4208-b133-f5ca7e110097' NOT NULL,
	"guildId" text NOT NULL,
	"userId" text NOT NULL,
	"status" text NOT NULL,
	"activity" text NOT NULL,
	"activityType" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reactionevent" (
	"timestamp" text NOT NULL,
	"createdAt" text NOT NULL,
	"id" text PRIMARY KEY DEFAULT '59443d13-9345-4830-a99b-5c5b2902f5c4' NOT NULL,
	"guildId" text NOT NULL,
	"channelId" text NOT NULL,
	"messageId" text NOT NULL,
	"userId" text NOT NULL,
	"emojiId" text NOT NULL,
	"emojiName" text NOT NULL,
	"emojiAnimated" text DEFAULT false NOT NULL,
	"action" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" text NOT NULL,
	"updatedAt" text NOT NULL,
	"username" text NOT NULL,
	"discriminator" text NOT NULL,
	"avatar" text NOT NULL,
	"bot" text DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voiceevent" (
	"timestamp" text NOT NULL,
	"createdAt" text NOT NULL,
	"id" text PRIMARY KEY DEFAULT '537d725b-6816-49a1-9c84-116b503603af' NOT NULL,
	"guildId" text NOT NULL,
	"channelId" text NOT NULL,
	"userId" text NOT NULL,
	"action" text NOT NULL,
	"duration" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "channel" ADD CONSTRAINT "channel_guildId_guild_id_fk" FOREIGN KEY ("guildId") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel" ADD CONSTRAINT "channel_parentId_channel_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guild" ADD CONSTRAINT "guild_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_guildId_guild_id_fk" FOREIGN KEY ("guildId") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberevent" ADD CONSTRAINT "memberevent_guildId_guild_id_fk" FOREIGN KEY ("guildId") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberevent" ADD CONSTRAINT "memberevent_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageevent" ADD CONSTRAINT "messageevent_guildId_guild_id_fk" FOREIGN KEY ("guildId") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageevent" ADD CONSTRAINT "messageevent_channelId_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageevent" ADD CONSTRAINT "messageevent_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presenceevent" ADD CONSTRAINT "presenceevent_guildId_guild_id_fk" FOREIGN KEY ("guildId") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presenceevent" ADD CONSTRAINT "presenceevent_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reactionevent" ADD CONSTRAINT "reactionevent_guildId_guild_id_fk" FOREIGN KEY ("guildId") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reactionevent" ADD CONSTRAINT "reactionevent_channelId_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reactionevent" ADD CONSTRAINT "reactionevent_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voiceevent" ADD CONSTRAINT "voiceevent_guildId_guild_id_fk" FOREIGN KEY ("guildId") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voiceevent" ADD CONSTRAINT "voiceevent_channelId_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voiceevent" ADD CONSTRAINT "voiceevent_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;