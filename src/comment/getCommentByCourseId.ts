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
            const { course_id } = data.query

            if (!course_id) {
                // return {
                //     success: false,
                //     message: 'Invalid course_id'
                // }
                return new Response(JSON.stringify({
                    success: false,
                    message: "Invalid course_id",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }

            const db = drizzle(env.DB);

            const commentList = await db.select().from(comments).where(eq(comments.course_id, course_id)).all();
            if (commentList.length == 0) {
                // return {
                //     success: false,
                //     message: 'No comments found'
                // }
                return new Response(JSON.stringify({
                    success: false,
                    message: "No comments found",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }

            const userList = await db.select().from(users).all()  

            const commentWithUsers = commentList
            .filter(comment => !comment.parent_id)
            .map(comment => {
                return {
                    ...comment,
                    userData: userList.find(user => user.user_id === comment.user_id),
                    children: commentList
                                .filter(child => child.parent_id === comment.comment_id)
                                .map(children => {
                                    return {
                                        ...children,
                                        userData: userList.find(user => user.user_id === children.user_id)
                                    }
                                
                                })
                };
            });

      
            // return { 
            //     success: true, 
            //     comments: commentWithUsers
            // }    
            return new Response(JSON.stringify({
                success: true,
                comments: commentWithUsers
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