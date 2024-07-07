CREATE TABLE `comments` (
	`comment_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`course_id` integer,
	`rate` integer,
	`comment` text,
	`comment_at` integer,
	`parent_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON UPDATE no action ON DELETE no action
);
