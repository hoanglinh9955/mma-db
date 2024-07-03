import { Bool, Int, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, User } from "typesOpenAPI";
export class GetCoursesByInstrucId extends OpenAPIRoute {
    static schema = {
        tags: ["Instructor"],
        summary: "Get Course By Instructor Id (Instructor)",
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

            const db = drizzle(env.DB);
            const courseResults = await db.select().from(courses).where(eq(courses.instructor_id, env.user_id)).all();

            if (!courseResults || courseResults.length === 0) {
                return new Response(JSON.stringify({
                    success: false,
                    message: "No courses found",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }
    
       
            return new Response(JSON.stringify({
                success: true,
                courses: courseResults
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