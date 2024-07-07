ALTER TABLE "user" RENAME COLUMN "bio" TO "shortBio";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "longBio" json;