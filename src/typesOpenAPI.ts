import { DateTime, Str, Num, Bool, Email, Arr } from "@cloudflare/itty-router-openapi";
import { z } from 'zod'

export const User = {
	user_name: new Str({example: "Linh"}),
	email: new Email(),	
	password: z.string().min(8).max(16),
	date_of_birth: new Str({example: "02-02-2002"}),
	image_url: new Str({example: "https://images.pexels.com/photos/3715583/pexels-photo-3715583.jpeg"}),
};

export const Chapter = {
	title: new Str({example: "title"}),
	description: new Str({example: "description"}),
	content_url: new Str({example: "content_url"}),
}

export const Course = {
	title: new Str({example: "Title"}),
	description: new Str({example: "description"}),	
	instructor_id: new Num({ example: 1 }),	
	price: new Num({ example: 900000 }),
	category: new Str({example: "basic"}),
	is_trial: new Bool({ example: "false" }),
	is_verify: new Bool({ example: "false" }),
	image_url: new Str({example: "https://images.pexels.com/photos/3715583/pexels-photo-3715583.jpeg"}),
	create_at: new Num({ example: 1718377307294 }),
};

export const Enrollment = {
	user_id: new Num({ example: 1 }),
	course_id: new Num({ example: 1 }),
	enrolled_at: new Num({ example: 1718377307294 }),
};

export const Comment = {
	user_id: new Num({ example: 1 }),
	course_id: new Num({ example: 1 }),
	rate: new Num({ example: 5 }),
	comment: new Str({example: "comment"}),
	comment_at: new Num({ example: 1718377307294 }),
};

export const UserCompleteChapter = {
	user_id: new Num({ example: 1 }),
	course_id: new Num({ example: 7 }),
	chapter_id: new Num({ example: 1 }),
	completed_at: new Num({ example: 1718377307294 }),
};