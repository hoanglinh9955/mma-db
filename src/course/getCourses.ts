import { Bool, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters } from "db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, User } from "typesOpenAPI";
export class GetCourses extends OpenAPIRoute {
    static schema = {
        tags: ["Course"],
        summary: "Get Course",
        parameters: {
            category: Query(Str, {
              description: 'sort course by category',
              required: false,
            }),
            newest: Query(Bool, {
                description: 'sort course by newest',
                required: false,
              }),
            name: Query(Str, {
                description: 'sort course by name',
                required: false,
              }),
          },
        responses: {
            "200": {
              description: "Get Successful",
              schema: {
                success: Boolean,
              },
            },
        },
    };

 
    async handle(request: Request, env: any, context: any, data: Record<string, any>) {
        try {

            const { category, newest, name } = data.query
            
            const db = drizzle(env.DB);
            const courseResults = await db.select().from(courses).where(eq(courses.is_verify, true)).all();

            if (!courseResults || courseResults.length === 0) {
                return {
                    success: false,
                    message: 'No courses found'
                }
            }

            // Fetch all chapters
            const chapterResults = await db.select().from(chapters).all();

            // Nest chapters within their respective courses
            const coursesWithChapters = courseResults.map(course => {
                return {
                    ...course,
                    chapters: chapterResults.filter(chapter => chapter.course_id === course.course_id)
                };
            });
            let filtedCourses = coursesWithChapters
            
            if (newest) {
                filtedCourses = filtedCourses.reverse()
            }

            if (category) {

                filtedCourses = filtedCourses.filter(course => course.category === category);
            }
            if (name) {
                filtedCourses = filtedCourses.filter(course => course.title.includes(name));
            }

            return  { 
                success: true, 
                courses: filtedCourses 
            }
        } catch (e) {
            return new Response(e)
        }
    }
}