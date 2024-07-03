import { Num, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, enrollments, comments } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Comment } from "typesOpenAPI";
export class DeleteComment extends OpenAPIRoute {
    static schema = {
        tags: ["Comment"],
        summary: "delete comment by comment id",
        requestBody: { 
            comment_id: new Num({ example: 2 }),
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

            const { comment_id } = data.body;

            if (!comment_id) {
                return {
                    success: false,
                    message: 'Invalid comment data'
                }
            }
            const db = drizzle(env.DB);

            const result = await db.delete(comments).where(eq(comments.comment_id, comment_id)).returning();

            if(!result){
                return {
                    success: false,
                    message: 'Failed to delete comment'
                }
            }
            return { 
                success: true, 
                comment: result[0] 
            }

        } catch (e) {
            return new Response(e)
        }
    }
}