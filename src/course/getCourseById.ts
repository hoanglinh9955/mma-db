import { Int, OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, User } from "typesOpenAPI";
export class GetCourseById extends OpenAPIRoute {
    static schema = {
        tags: ["Course"],
        summary: "Get Course By Id",
        parameters: {
            course_id: Query(Int, {
              description: 'Input ccourse_id to get the course you want',
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

            const db = drizzle(env.DB);
            const courseResults = await db.select().from(courses).where(and(eq(courses.course_id, course_id), eq(courses.is_verify, true))).all();

            if (!courseResults || courseResults.length === 0) {
            // return {
            //     success: false,
            //     message: 'No courses found'
            // }
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

            // Fetch all chapters
            const chapterResults = await db.select().from(chapters).where(eq(chapters.course_id, course_id)).all();

            // Nest chapters within their respective courses
            const coursesWithChapters = courseResults.map(course => {
                return {
                    ...course,
                    chapters: chapterResults.filter(chapter => chapter.course_id === course.course_id)
                };
            });

            // return  { 
            //     success: true, 
            //     courses: coursesWithChapters 
            // }
            return new Response(JSON.stringify({
                success: true,
                courses: coursesWithChapters,
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