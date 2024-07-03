import { Bool, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters } from "db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, User } from "typesOpenAPI";
export class GetCoursesByInstructor extends OpenAPIRoute {
    static schema = {
        tags: ["Course"],
        summary: "Get All Instructors",
        parameters: {
            name: Query(Str, {
                description: 'sort instructor by name',
                required: false,
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

            const { name } = data.query

            const db = drizzle(env.DB);
            const instructorList = await db.select().from(users).where(eq(users.role, 'INSTRUCTOR')).all()  

            if (!instructorList || instructorList.length === 0) {
                return {
                    success: false,
                    message: 'No Instructor found'
                }
            }

            let filtedCourses = instructorList;

            if (name) {
                filtedCourses = filtedCourses.filter(instructor => instructor.user_name.toLowerCase().includes(name.toLowerCase()));
            }

            // Fetch all chapters
            const courseResults = await db.select().from(courses).where(eq(courses.is_verify, true)).all();

            // Nest chapters within their respective courses
            const instructorWithCourse = filtedCourses.map(instructor => {
                return {
                    ...instructor,
                    courses: courseResults.filter(course => course.instructor_id === instructor.user_id)
                };
            });

            const chapterResults = await db.select().from(chapters).all();
            
            const instructorWithCourseWithChapter = instructorWithCourse.map(instructor => {
                return {
                    ...instructor,
                    courses: instructor.courses.map(course => {
                        return {
                            ...course,
                            chapters: chapterResults.filter(chapter => chapter.course_id === course.course_id)
                        };
                    })
                };
            });

            return  { 
                success: true, 
                instructorList: instructorWithCourseWithChapter 
            }
        } catch (e) {
            return new Response(e)
        }
    }
}