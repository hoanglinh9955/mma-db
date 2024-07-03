import { Num, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, enrollments, comments } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Comment } from "typesOpenAPI";
export class EditComment extends OpenAPIRoute {
    static schema = {
        tags: ["Comment"],
        summary: "edit comment by comment id",
        requestBody: { comment: {
            comment_id: new Num({ example: 2 }),
            comment: new Str({ example: "updated comment" }),
            rate: new Num({ example: 4 }),
        }}, 
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

            const { comment } = data.body;

            if (!comment) {
                return {
                    success: false,
                    message: 'Invalid comment data'
                }
            }
            comment.user_id = env.user_id;
            const db = drizzle(env.DB);

            const result = await db.update(comments).set({comment: comment.comment, rate: comment.rate}).where(eq(comments.comment_id, comment.comment_id)).returning();

            if(!result){
                return {
                    success: false,
                    message: 'Failed to edit comment'
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