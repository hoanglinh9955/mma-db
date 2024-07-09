import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters } from "db/schema";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, User } from "typesOpenAPI";

export class AddCourse extends OpenAPIRoute {
    static schema = {
        tags: ["Instructor"],
        summary: "add Course",
        requestBody: {
            courseData: Course,
            chapterData: [Chapter]
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

            const { courseData, chapterData } = data.body;

            if (!courseData || !Array.isArray(chapterData)) {
                return new Response(JSON.stringify({
                    success: false,
                    message: "Invalid course data",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }

            courseData.instructor_id = env.user_id;
            const db = drizzle(env.DB);

            const courseResults = await db.insert(courses).values(courseData).returning();
            if (!courseResults || courseResults.length === 0) {
                return new Response(JSON.stringify({
                    success: false,
                    message: "No course was inserted",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }

            const courseId = courseResults[0].course_id;
            const chapterPromises = chapterData.map(async chapter => {
                chapter.course_id = courseId;
                const result = await db.insert(chapters).values(chapter).returning();
                return result;
            });

            const ChapterArray = await Promise.all(chapterPromises);

            return new Response(JSON.stringify({
                success: true,
                courseResults: courseResults[0],
                ChapterArray,
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            });

        } catch (e) {
            return new Response(JSON.stringify({
                success: false,
                message: e.message,
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            });
        }
    }
}
