import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, enrollments, comments } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Comment } from "typesOpenAPI";
export class AddComment extends OpenAPIRoute {
    static schema = {
        tags: ["Comment"],
        summary: "add comment",
        requestBody: { comment: Comment }, 
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

            const db = drizzle(env.DB);

            const result = await db.insert(comments).values(comment).returning();
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