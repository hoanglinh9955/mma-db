import { Int, Num, OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { user_complete_chapter } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
export class deleteCompleteCourse extends OpenAPIRoute {
    static schema = {
        tags: ["Course"],
        summary: "delete comple Course",
        requestBody: {
            course_id: new Num({ example: 1 }),
            chapter_id: new Num({ example: 1 }),
        },
        responses: {
            "200": {
              description: "delete Successful",
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

            const { course_id, chapter_id } = data.body;

            if (!course_id || !chapter_id) {
                return {
                    success: false,
                    message: 'Invalid data'
                }
            }
            const db = drizzle(env.DB);
            const result = await db.delete(user_complete_chapter).where(and(eq(user_complete_chapter.user_id, env.user_id), eq(user_complete_chapter.course_id, course_id), eq(user_complete_chapter.chapter_id, chapter_id))).returning();
      
            
      
            return { 
                result
            }

        } catch (e) {
            return new Response(e)
        }
    }
}