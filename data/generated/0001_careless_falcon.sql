CREATE TABLE "feeds_follows" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"feed_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "feed_user" PRIMARY KEY("feed_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "feeds_follows" ADD CONSTRAINT "feeds_follows_feed_id_feeds_id_fk" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "feeds_follows" ADD CONSTRAINT "feeds_follows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;