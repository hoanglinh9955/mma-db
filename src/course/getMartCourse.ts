import { Int, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, user_complete_chapter } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, User, UserCompleteChapter } from "typesOpenAPI";
export class GetMartCourse extends OpenAPIRoute {
    static schema = {
        tags: ["Course"],
        summary: "Get Mart Course",
        parameters: {
        user_id: Query(Int, {
              description: 'insert user_id to get complete chapter',
            }),
        course_id: Query(Int, {
            description: 'insert course_id to get complete chapter',
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
            const { user_id, course_id } = data.query


            if (!user_id || !course_id) {
                return {
                    success: false,
                    message: 'undefined data'
                }
            }

            const db = drizzle(env.DB);
          
            const result = await db.select().from(user_complete_chapter)
                                .where(and(eq(user_complete_chapter.user_id, user_id), eq(user_complete_chapter.course_id, course_id))).all();
            if (result.length === 0) {
                return {
                    success: false,
                    message: 'No Chapter was Completed'
                }
            }
            let dataResult = result.map(chapter => ({
                chapter_id: chapter.chapter_id,
                completed_at: chapter.completed_at
            }));

            return { 
                success: true, 
                chapterCompleted: dataResult
            }

        } catch (e) {
            return new Response(e)
        }
    }
}