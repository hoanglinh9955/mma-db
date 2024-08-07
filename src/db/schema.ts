import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  user_id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  user_name: text('user_name', { length: 255 }).unique(),
  instruction_description: text('instruction_description'),
  email: text('email', { length: 255 }).unique(),
  password: text('password'),
  date_of_birth: text('date_of_birth'),
  role: text('role', { enum: ["USER", "ADMIN", "INSTRUCTOR", "STAFF"]}),
  image_url: text('image_url'),
  status: integer('status', { mode: 'boolean' }).default(true),
});

export const users_sessions = sqliteTable('users_sessions', {
  session_id: integer('session_id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').references(() => users.user_id),
  token: text('token'),
  expires_at: integer('expires_at'),
});

export const courses = sqliteTable('courses', {
  course_id: integer('course_id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title'),
  description: text('description'),
  instructor_id: integer('instructor_id').references(() => users.user_id),
  price: integer('price', { mode: 'number' }), 
  category: text('category', { length: 100 }),
  is_trial: integer('is_trial', { mode: 'boolean' }),
  is_verify: integer('is_verify', { mode: 'boolean' }),
  is_submit: integer('is_submit', { mode: 'boolean' }),
  is_update: integer('is_update', { mode: 'boolean' }),
  image_url: text('image_url'),
  hour: integer('hour', { mode: 'number' }),
  create_at: integer('create_at'),
  update_at: integer('update_at'),
  comments: text('comments'),
  comment_owner: text('comment_owner'),
  comment_owner_avatar: text('comment_owner_avatar'),
  comment_at: integer('comment_at'),
});

export const chapters = sqliteTable('chapter', {
  chapter_id: integer('chapter_id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  course_id: integer('course_id').references(() => courses.course_id),
  title: text('title'),
  description: text('description'),
  content_url: text('content_url'),
});

export const enrollments = sqliteTable('enrollments', {
  enrollment_id: integer('enrollment_id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  user_id: integer('customer_id').references(() => users.user_id),
  course_id: integer('course_id').references(() => courses.course_id),
  enrolled_at: integer('enrolled_at'),
  instructor_id: integer('instructor_id').references(() => users.user_id),
  price: integer('price', { mode: 'number' }),
});

export const comments = sqliteTable('comments', {
  comment_id: integer('comment_id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').references(() => users.user_id),
  course_id: integer('course_id').references(() => courses.course_id),
  rate: integer('rate'),
  comment: text('comment'),
  comment_at: integer('comment_at'),
  parent_id: integer('parent_id'),
});

export const user_complete_chapter = sqliteTable('user_complete_chapter', {
  user_id: integer('user_id').references(() => users.user_id),
  course_id: integer('course_id').references(() => courses.course_id),
  chapter_id: integer('chapter_id').references(() => chapters.chapter_id),
  completed_at: integer('completed_at')
});