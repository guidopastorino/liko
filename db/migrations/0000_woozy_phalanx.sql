CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"fullname" text,
	"email" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
