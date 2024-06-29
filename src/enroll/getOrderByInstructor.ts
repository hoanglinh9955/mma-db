import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, enrollments } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, Enrollment, User } from "typesOpenAPI";
export class GetOrderByInstructor extends OpenAPIRoute {
    static schema = {
        tags: ["Instructor"],
        summary: "get Order By Instructor Id (Instructor)",
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


            const result = await db.select().from(enrollments)
            .where(eq(enrollments.instructor_id, env.user_id))
            
            if (result.length === 0) {
                return {
                    success: false,
                    message: 'No enrollmet was found'
                }
            }
      
            return { 
                success: true,
                result
            }

        } catch (e) {
            return new Response(e)
        }
    }
}