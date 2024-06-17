ALTER TABLE "category" DROP CONSTRAINT "category_parentId_category_id_fk";
--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "category" DROP COLUMN IF EXISTS "parentId";