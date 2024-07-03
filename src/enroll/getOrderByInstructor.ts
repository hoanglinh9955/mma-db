import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, enrollments } from "db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, Enrollment, User } from "typesOpenAPI";
export class GetOrderByInstructor extends OpenAPIRoute {
    static schema = {
        tags: ["Instructor"],
        summary: "get Order By Instructor Id (Instructor)",
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


            const result = await db.select().from(enrollments)
            .where(eq(enrollments.instructor_id, env.user_id))
            
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
            const courseResults = await db.select().from(courses).where(eq(courses.instructor_id, env.user_id)).all()

            const chapterResults = await db.select().from(chapters).all()

            const orderWithCourseAndChapter = result.map(order => {
                return {
                    ...order,
                    course: courseResults.find(course => course.course_id === order.course_id),
                    chapter: chapterResults.filter(chapter => chapter.course_id === order.course_id)
                };
            });
      
            return { 
                success: true,
                orderWithCourseAndChapter
            }

        } catch (e) {
            return new Response(e)
        }
    }
}