import { Bool, Int, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, User } from "typesOpenAPI";
export class GetCoursesByInstructorId extends OpenAPIRoute {
    static schema = {
        tags: ["Course"],
        summary: "Get Course",
        parameters: {
            id: Query(Int, {
              description: 'insert instructor id',
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

            const { id } = data.query
            
            const db = drizzle(env.DB);
            const courseResults = await db.select().from(courses).where(and(eq(courses.is_verify, true), eq(courses.instructor_id, id))).all();

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

            return  { 
                success: true, 
                courses: coursesWithChapters 
            }
        } catch (e) {
            return new Response(e)
        }
    }
}