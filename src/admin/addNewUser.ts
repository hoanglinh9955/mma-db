import { Email, Num, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { getBearer } from "auth/authenticateUser";
import { users, users_sessions } from "db/schema";
import { and, eq, gt } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { z } from 'zod'
export class AddNewUser extends OpenAPIRoute {
    static schema = {
        tags: ["Admin"],
        summary: "add new user",
        requestBody: {
            userData: {
            user_name: new Str(),
            email: new Email(),
            role: new Str(),
            }
        },
        responses: {
            "200": {
                description: "Get Users Successful",
                schema: {
                    success: Boolean,
                    results: Boolean,
                },
            },
            "401": {
                description: "Unauthorized",
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
            const { userData } = data.body;
            const { user_name, email, role } = userData;
            const db = drizzle(env.DB);

            // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // if (!emailRegex.test(email)) {
            //     // return {
            //     //     success: false,
            //     //     message: 'Invalid email format'
            //     // };
            //     return new Response(JSON.stringify({ success: false, message: "Invalid email format" }), {
            //         headers: {
            //             'Content-Type': 'application/json',
            //             ...corsHeaders,
            //         },
            //     });
            // }


            const check1 = await db.select().from(users).where(eq(users.email, email.toLowerCase())).all();
            if(check1[0]){
                return new Response(JSON.stringify({ success: false, message: "User Email already exists" }), {
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders,
                    },
                });
            }
            const check2 = await db.select().from(users).where(eq(users.user_name, user_name)).all();
         
            if(check2[0]){
                return new Response(JSON.stringify({ success: false, message: "User Name already exists" }), {
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders,
                    },
                });
            }

            const results = await db.insert(users).values({user_name: user_name, email: email, image_url: 'https://i.pinimg.com/736x/99/52/c8/9952c84b4c75fa172673937fdf16d804.jpg', role: role, password: '9e4de64d5e8578ac75db97311fcd9320c62a15489089ed63ad11d8ff97d0a79d'}).returning();
           
            if (!results || results.length === 0) {
                return new Response(JSON.stringify({ success: false, message: "Failed to add user" }), {
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders,
                    },
                });
            }
            return new Response(JSON.stringify({ success: true, results }), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            });

        } catch (e) {
            return new Response(JSON.stringify({ success: false, message: e.message }), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            });
        }

      
    }
}