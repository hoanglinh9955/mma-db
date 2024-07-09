import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, enrollments } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, Enrollment, User } from "typesOpenAPI";
export class GetOrder extends OpenAPIRoute {
    static schema = {
        tags: ["Admin"],
        summary: "get Orders",
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
            const corsHeaders = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json;charset=UTF-8'
            };

            const db = drizzle(env.DB);
            // if (!data || !data.body) {
            //     return new Response(JSON.stringify({
            //         success: false,
            //         message: "Request body is missing",
            //     }), {
            //         headers: {
            //             ...corsHeaders,
            //             'Content-Type': 'application/json;charset=UTF-8',
            //         },
            //     });
            // }
            // const instructorWithCourseWithChapter = instructorWithCourse.map(instructor => {
            //     return {
            //         ...instructor,
            //         courses: instructor.courses.map(course => {
            //             return {
            //                 ...course,
            //                 chapters: chapterResults.filter(chapter => chapter.course_id === course.course_id)
            //             };
            //         })
            //     };
            // });


            const result = await db.select().from(enrollments).all()
            if (result.length === 0) {
                return new Response(JSON.stringify({
                    success: false,
                    message: "No Order Found",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }
           
      
            // return { 
            //     success: true,
            //     orderWithCourseAndChapter
            // }
            return new Response(JSON.stringify({
                success: true,
                result
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