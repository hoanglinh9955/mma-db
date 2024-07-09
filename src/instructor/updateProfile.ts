import { OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { courses, users, chapters, enrollments } from "db/schema";
import { and, eq, ne } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Chapter, Course, CustomerProfile, Enrollment, User } from "typesOpenAPI";
export class UpdateInstructorProfile extends OpenAPIRoute {
    static schema = {
        tags: ["Instructor"],
        summary: "update profile",
        requestBody: { userData: {
            user_name: new Str({ example: 'John Doe'}),
            email: new Str({ example: 'email@gmail.com'}),
            date_of_birth: new Str({ example: '2022-01-01'}),
            image_url: new Str({ example: 'https://example.com/avatar.jpg'}),
            instruction_description: new Str({ example: 'This is a description'}),
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
                // return {
                //     success: false,
                //     message: 'Request body is missing'
                // }
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

            const { userData } = data.body;

            if (!userData) {
                // return {
                //     success: false,
                //     message: 'Invalid user data'
                // }
                return new Response(JSON.stringify({
                    success: false,
                    message: "Invalid user data",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }

            const db = drizzle(env.DB);

            const check = await db.select().from(users).where(and(eq(users.email, userData.email.toLowerCase()), ne(users.user_id, env.user_id))).all();

            if(check.length > 0) {
                // return {
                //     success: false,
                //     message: 'Email is Exist Please use another email'
                // }
                return new Response(JSON.stringify({
                    success: false,
                    message: "Email is Exist Please use another email",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }

            const checkUserName = await db.select().from(users).where(and(eq(users.user_name, userData.user_name), ne(users.user_id, env.user_id))).all();

            if(checkUserName.length > 0) {
                return new Response(JSON.stringify({
                    success: false,
                    message: "User Name is Exist Please use another User Name",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }

            const check1 = await db.select().from(users).where(and(eq(users.email, userData.email), eq(users.user_id, env.user_id))).all();
            const check2 = await db.select().from(users).where(and(eq(users.user_name, userData.user_name), ne(users.user_id, env.user_id))).all();
            let result
            if(check1.length === 0 && check2.length === 0) {
             result = await db.update(users).set({user_name:userData.user_name, email: userData.email, date_of_birth: userData.date_of_birth, image_url: userData.image_url, instruction_description: userData.instruction_description}).where(eq(users.user_id, env.user_id)).returning();
            } else if(check1.length > 0 && check2.length === 0) {
             result = await db.update(users).set({user_name:userData.user_name, date_of_birth: userData.date_of_birth, image_url: userData.image_url, instruction_description: userData.instruction_description}).where(eq(users.user_id, env.user_id)).returning();
            }else if(check1.length === 0 && check2.length > 0) {
             result = await db.update(users).set({email: userData.email, date_of_birth: userData.date_of_birth, image_url: userData.image_url, instruction_description: userData.instruction_description}).where(eq(users.user_id, env.user_id)).returning();
            }else if(check1.length > 0 && check2.length > 0) {
             result = await db.update(users).set({date_of_birth: userData.date_of_birth, image_url: userData.image_url, instruction_description: userData.instruction_description}).where(eq(users.user_id, env.user_id)).returning();
            }
             if (!result) {
                // return {
                //     success: false,
                //     message: 'No data was inserted'
                // }
                return new Response(JSON.stringify({
                    success: false,
                    message: "No data was inserted",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }

      
            // return { 
            //     success: true, 
            //     data: result
            // }
            return new Response(JSON.stringify({
                success: true,
                data: result
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
            }
            )
        }
    }
}