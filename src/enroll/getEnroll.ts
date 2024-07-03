import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, enrollments, user_complete_chapter } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, Enrollment, User } from "typesOpenAPI";
export class GetEnroll extends OpenAPIRoute {
    static schema = {
        tags: ["Enroll"],
        summary: "get Enroll",
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

            const result = await db.select().from(enrollments).where(eq(enrollments.user_id, env.user_id)).all();
            if (result.length === 0) {
                return {
                    success: false,
                    message: 'No enrollment was found'
                }
            }
            const instructorResult = await db.select().from(users).where(eq(users.role, 'INSTRUCTOR')).all()

            const courseResults = await db.select().from(courses).all();

            const chapterResults = await db.select().from(chapters).all();
      
            const courseCompleteUser = await db.select().from(user_complete_chapter).where(eq(user_complete_chapter.user_id, env.user_id)).all()

            const enrollData = result.map(enroll => {
                return {
                    ...enroll,
                    instructor: instructorResult.filter(instructor => instructor.user_id === enroll.instructor_id),
                    course: courseResults.find(course => course.course_id === enroll.course_id),
                    chapters: chapterResults.filter(chapter => chapter.course_id === enroll.course_id),
                    courseCompleted: courseCompleteUser.filter(chapterComplete => chapterComplete.course_id === enroll.course_id)
                };
            });
            return { 
                success: true, 
                enrollData: enrollData 
            }

        } catch (e) {
            return new Response(e)
        }
    }
}