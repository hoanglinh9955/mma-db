import { Num, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, enrollments, comments } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Comment } from "typesOpenAPI";
export class AddCommentInstructor extends OpenAPIRoute {
    static schema = {
        tags: ["Instructor"],
        summary: "add comment",
        requestBody: {
            comment: {
                course_id: new Num({ example: 1 }),
                comment: new Str({ example: "comment" }),
                comment_at: new Num({ example: 1718377307294 }),
            }
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
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // if (request.method === 'OPTIONS') {
        //     return new Response(null, {
        //         headers: {
        //             ...corsHeaders,
        //             'Access-Control-Max-Age': '86400',
        //         },
        //     });
        // }


        try {
            if (!data || !data.body) {
                // return {
                //     success: false,
                //     message: 'Request body is missing'
                // }
                return new Response(JSON.stringify({
                    success: false,
                    message: "Request body is missing",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }

            const { comment } = data.body;

            if (!comment) {
                // return {
                //     success: false,
                //     message: 'Invalid comment data'
                // }
                return new Response(JSON.stringify({
                    success: false,
                    message: "Invalid comment data",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }
            comment.user_id = env.user_id;
            const db = drizzle(env.DB);

            const result = await db.insert(comments).values(comment).returning();
      

      
            const userList = await db.select().from(users).where(eq(users.role, 'USER')).all()  

            const commentWithUsers = result.map(comment => {
                // return {
                //     ...comment,
                //     userData: userList.find(user => user.user_id === comment.user_id)
                // };
                return new Response(JSON.stringify({
                    ...comment,
                    userData: userList.find(user => user.user_id === comment.user_id)
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
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