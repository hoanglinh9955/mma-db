import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, enrollments } from "db/schema";
import { and, eq, ne } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, CustomerProfile, Enrollment, User } from "typesOpenAPI";
export class UpdateCustomerProfile extends OpenAPIRoute {
    static schema = {
        tags: ["User"],
        summary: "update user",
        requestBody: { userData: CustomerProfile }, 
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

            const { userData } = data.body;

            if (!userData) {
                return {
                    success: false,
                    message: 'Invalid user data'
                }
            }

            const db = drizzle(env.DB);

            const check = await db.select().from(users).where(and(eq(users.email, userData.email), ne(users.user_id, env.user_id))).all();
            if(check.length > 0) {
                return {
                    success: false,
                    message: 'Email is Exist Please use another email'
                }
            }
            const check1 = await db.select().from(users).where(and(eq(users.email, userData.email), eq(users.user_id, env.user_id))).all();
            let result
            if(check1.length === 0) {
             result = await db.update(users).set({user_name:userData.user_name, email: userData.email, date_of_birth: userData.date_of_birth, image_url: userData.image_url}).where(eq(users.user_id, env.user_id)).returning();
            } else {
             result = await db.update(users).set({user_name:userData.user_name, date_of_birth: userData.date_of_birth, image_url: userData.image_url}).where(eq(users.user_id, env.user_id)).returning();
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