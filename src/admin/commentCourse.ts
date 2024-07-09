import { Bool, Num, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters } from "db/schema";
import { eq, is } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, User } from "typesOpenAPI";

export class CommentCourse extends OpenAPIRoute {
    static schema = {
        tags: ["Admin"],
        summary: "Comment Course",
        requestBody: {
            course_id: new Num({ example: 1}),
            comment: new Str({ example: "This is a comment"}),
            comment_owner: new Str({ example: 'John Doe'}),
            comment_owner_avatar: new Str({ example: 'https://example.com/avatar.jpg'}),
            comment_at: new Num({ example: 1630000000}),
            is_submit: new Bool({ example: false}),
            is_update: new Bool({ example: false}),
            is_verify: new Bool({ example: false}),
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

            const { course_id, comment, comment_owner, comment_owner_avatar, comment_at, is_submit, is_update, is_verify } = data.body;

            const db = drizzle(env.DB);

            const updateCousre = await db.update(courses).set({comments: comment, comment_owner: comment_owner, comment_owner_avatar: comment_owner_avatar, comment_at: comment_at, is_submit: is_submit, is_update: is_update, is_verify: is_verify}).where(eq(courses.course_id, course_id)).returning();

            
            return new Response(JSON.stringify({
                success: true,
                results: updateCousre[0]
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            });

        } catch (e) {
            return new Response(JSON.stringify({
                success: false,
                error: e.message,
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            });
        }
    }
}
