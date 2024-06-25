import { Bool, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters } from "db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, User } from "typesOpenAPI";
export class GetCoursesByInstructor extends OpenAPIRoute {
    static schema = {
        tags: ["Course"],
        summary: "Get All Instructors",
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

            const db = drizzle(env.DB);
            const instructorList = await db.select().from(users).where(eq(users.role, 'INSTRUCTOR')).all()  

            if (!instructorList || instructorList.length === 0) {
                return {
                    success: false,
                    message: 'No Instructor found'
                }
            }

            // Fetch all chapters
            const courseResults = await db.select().from(courses).all();

            // Nest chapters within their respective courses
            const instructorWithCourse = instructorList.map(instructor => {
                return {
                    ...instructor,
                    courses: courseResults.filter(course => course.instructor_id === instructor.user_id)
                };
            });
         

            return  { 
                success: true, 
                instructorList: instructorWithCourse 
            }
        } catch (e) {
            return new Response(e)
        }
    }
}