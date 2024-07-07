import { Num, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, enrollments, comments } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Comment } from "typesOpenAPI";
export class DeleteCommentInstructor extends OpenAPIRoute {
    static schema = {
        tags: ["Instructor"],
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

            const { comment_id } = data.body;

            if (!comment_id) {
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
            const db = drizzle(env.DB);

            const result = await db.delete(comments).where(eq(comments.comment_id, comment_id)).returning();

            if(!result){
                // return {
                //     success: false,
                //     message: 'Failed to delete comment'
                // }
                return new Response(JSON.stringify({
                    success: false,
                    message: "Failed to delete comment",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }
            // return { 
            //     success: true, 
            //     comment: result[0] 
            // }
            return new Response(JSON.stringify({
                success: true,
                comment: result[0]
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            });

        } catch (e) {
            return new Response(e)
        }
    }
}