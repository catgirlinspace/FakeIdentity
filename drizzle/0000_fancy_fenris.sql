CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `cas_service_tickets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`service` text NOT NULL,
	`token` text NOT NULL,
	`created_at` integer,
	`user_id` integer NOT NULL,
	`is_valid` integer DEFAULT true NOT NULL
);
