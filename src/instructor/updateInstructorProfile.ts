import { Email, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, enrollments } from "db/schema";
import { and, eq, ne } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, CustomerProfile, Enrollment, User } from "typesOpenAPI";
export class UpdateInstructorProfile extends OpenAPIRoute {
    static schema = {
        tags: ["Instructor"],
        summary: "update instructor profile",
        requestBody: {
            instructorData: {
                user_name: new Str({ example: "Linh" }),
                email: new Email(),
                date_of_birth: new Str({ example: "2000-01-01" }),
                instruction_description: new Str({ example: "I am a good instructor" }),
                image_url: new Str({ example: "https://images.pexels.com/photos/3715583/pexels-photo-3715583.jpeg" }),
        } }, 
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
        try {
            if (!data || !data.body) {
                return {
                    success: false,
                    message: 'Request body is missing'
                }
            }

            const { instructorData } = data.body;

            if (!instructorData) {
                return {
                    success: false,
                    message: 'Invalid user data'
                }
            }

            const db = drizzle(env.DB);

            const check = await db.select().from(users).where(and(eq(users.email, instructorData.email), ne(users.user_id, env.user_id))).all();
            if(check.length > 0) {
                return {
                    success: false,
                    message: 'Email is Exist Please use another email'
                }
            }
            const check1 = await db.select().from(users).where(and(eq(users.email, instructorData.email), eq(users.user_id, env.user_id))).all();
            let result
            if(check1.length === 0) {
             result = await db.update(users).set({user_name:instructorData.user_name, email: instructorData.email, date_of_birth: instructorData.date_of_birth, image_url: instructorData.image_url, instruction_description: instructorData.instruction_description}).where(eq(users.user_id, env.user_id)).returning();
            } else {
             result = await db.update(users).set({user_name:instructorData.user_name, date_of_birth: instructorData.date_of_birth, image_url: instructorData.image_url, instruction_description: instructorData.instruction_description }).where(eq(users.user_id, env.user_id)).returning();
            }
            if (!result) {
                return {
                    success: false,
                    message: 'No data was inserted'
                }
            }

      
            return { 
                success: true, 
                data: result
            }

        } catch (e) {
            return new Response(e)
        }
    }
}