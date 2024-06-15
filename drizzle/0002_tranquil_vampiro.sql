ALTER TABLE "user" RENAME COLUMN "image" TO "avatar";--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "content" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "metadata" json;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "xLink" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "redditLink" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "linkedInLink" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "githubLink" text;