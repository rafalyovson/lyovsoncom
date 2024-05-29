CREATE TABLE IF NOT EXISTS "socialNetwork" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text,
	"url" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "socialNetwork" ADD CONSTRAINT "socialNetwork_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
