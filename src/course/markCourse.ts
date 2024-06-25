import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, user_complete_chapter } from "db/schema";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, User, UserCompleteChapter } from "typesOpenAPI";
export class MartCourse extends OpenAPIRoute {
    static schema = {
        tags: ["Course"],
        summary: "Mart Course",
        requestBody: {
            courseData: UserCompleteChapter
        },
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

            const { courseData } = data.body;

            if (!courseData) {
                return {
                    success: false,
                    message: 'Invalid course data'
                }
            }
            courseData.user_id = env.user_id;
            const db = drizzle(env.DB);
          
            const result = await db.insert(user_complete_chapter).values(courseData).returning();
            if (result.length === 0) {
                return {
                    success: false,
                    message: 'No courseData was inserted'
                }
            }
            
      
            return { 
                success: true, 
                courseData: result[0]
            }

        } catch (e) {
            return new Response(e)
        }
    }
}