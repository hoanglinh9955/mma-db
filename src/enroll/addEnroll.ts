import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, enrollments } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, Enrollment, User } from "typesOpenAPI";
export class AddEnroll extends OpenAPIRoute {
    static schema = {
        tags: ["Enroll"],
        summary: "add Enroll",
        requestBody: { enrollment: Enrollment }, 
        responses: {
            "200": {
              description: "Post Successful",
              schema: {
                success: Boolean,
              },
            },
        },
    };

 
    async handle(request: Request, env: any, context: any, data: Record<string, any>) {
        try {
            if (!data || !data.body) {
                return {
                    success: false,
                    message: 'Request body is missing'
                }
            }

            const { enrollment } = data.body;

            if (!enrollment) {
                return {
                    success: false,
                    message: 'Invalid enrollment data'
                }
            }

            const db = drizzle(env.DB);

            const check = await db.select().from(enrollments).where(and(eq(enrollments.course_id, enrollment.course_id), eq(enrollments.user_id, env.user_id))).all();
            if(check.length > 0) {
                return {
                    success: false,
                    message: 'User already enrolled in this course'
                }
            }
            enrollment.user_id = env.user_id;
            const result = await db.insert(enrollments).values(enrollment).returning();
            if (!request) {
                return {
                    success: false,
                    message: 'No enrollment was inserted'
                }
            }

      
            return { 
                success: true, 
                enrollment: result[0] 
            }

        } catch (e) {
            return new Response(e)
        }
    }
}