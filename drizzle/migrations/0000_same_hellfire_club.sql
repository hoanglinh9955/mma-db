CREATE TABLE `chapter` (
	`chapter_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer,
	`title` text,
	`description` text,
	`content_url` text,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`comment_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`course_id` integer,
	`rate` integer,
	`comment` text,
	`comment_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`course_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`description` text,
	`instructor_id` integer,
	`price` integer,
	`category` text(100),
	`is_trial` integer,
	`is_verify` integer,
	`image_url` text,
	`create_at` integer,
	FOREIGN KEY (`instructor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`enrollment_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer_id` integer,
	`course_id` integer,
	`enrolled_at` integer,
	FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_complete_chapter` (
	`user_id` integer,
	`course_id` integer,
	`chapter_id` integer,
	`completed_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`chapter_id`) REFERENCES `chapter`(`chapter_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_name` text(255),
	`email` text(255),
	`password` text,
	`date_of_birth` text,
	`role` text,
	`image_url` text
);
--> statement-breakpoint
CREATE TABLE `users_sessions` (
	`session_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`token` text,
	`expires_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);