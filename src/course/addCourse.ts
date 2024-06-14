import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters } from "db/schema";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, User } from "typesOpenAPI";
export class AddCourse extends OpenAPIRoute {
    static schema = {
        tags: ["Course"],
        summary: "add Course",
        requestBody: {
            courseData: Course,
            chapterData: [Chapter]
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

            const { courseData, chapterData } = data.body;

            if (!courseData || !Array.isArray(chapterData)) {
                return {
                    success: false,
                    message: 'Invalid course data'
                }
            }

            const db = drizzle(env.DB);
          
            const courseResults = await db.insert(courses).values(courseData).returning();
            if (!courseResults || courseResults.length === 0) {
                return {
                    success: false,
                    message: 'No course was inserted'
                }
            }

            const courseId = courseResults[0].course_id;
            const chapterPromises = chapterData.map(async chapter => {
                chapter.course_id = courseId;
                const result = await db.insert(chapters).values(chapter).returning();
                return result;
            });
            
            const ChapterArray = await Promise.all(chapterPromises);
            // Insert the chapters
            
      
            return { 
                success: true, 
                courseResults: courseResults[0],
                ChapterArray 
            }

        } catch (e) {
            return new Response(e)
        }
    }
}