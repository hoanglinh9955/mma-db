import { Int, OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, enrollments, comments } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Comment } from "typesOpenAPI";
export class getCommentByCourseId extends OpenAPIRoute {
    static schema = {
        tags: ["Comment"],
        summary: "get comment by course id",
        parameters: {
            course_id: Query(Int, {
              description: 'Input ccourse_id to get the comment List',
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
            const { course_id } = data.query

            if (!course_id) {
                return {
                    success: false,
                    message: 'Invalid course_id'
                }
            }

            const db = drizzle(env.DB);

            const result = await db.select().from(comments).where(eq(comments.course_id, course_id)).all();
            if (result.length == 0) {
                return {
                    success: false,
                    message: 'No comments found'
                }
            }

            const userList = await db.select().from(users).where(eq(users.role, 'USER')).all()  

            const commentWithUsers = result.map(comment => {
                return {
                    ...comment,
                    userData: userList.find(user => user.user_id === comment.user_id)
                };
            });

      
            return { 
                success: true, 
                comments: commentWithUsers
            }    

        } catch (e) {
            return new Response(e)
        }
    }
}