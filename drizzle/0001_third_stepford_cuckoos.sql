ALTER TABLE "user" ADD COLUMN "is_restricted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "restricted_reason" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "restricted_at" timestamp;